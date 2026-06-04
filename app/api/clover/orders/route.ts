/**
 * CLOVER ORDERS API
 *
 * POST /api/clover/orders   → crea un pedido de recogida en Clover
 * GET  /api/clover/orders?orderId=XXX → consulta el estado de un pedido
 *
 * Modelo v1: "reservar y pagar al recoger". Creamos la orden con line items
 * PERSONALIZADOS (nombre + precio), sin depender de que el producto exista en
 * el inventario de Clover. Aparece en el POS de Edelweiss con productos, total
 * y los datos del cliente en la nota.
 *
 * Body POST:
 * {
 *   items: [{ name: string, price: number, quantity: number, itemId?: string }],
 *   customer: { name: string, email: string, phone?: string },
 *   pickupDate: "YYYY-MM-DD",   // hora local de Maine (Eastern)
 *   pickupSlot: "HH:mm",         // 07:00 .. 13:00
 *   notes?: string
 * }
 *
 * SEGURIDAD: el token de Clover nunca sale del servidor. Ver SECURITY.md.
 */

import { NextRequest, NextResponse } from "next/server";

const isSandbox = process.env.NEXT_PUBLIC_ENV === "sandbox";
const CLOVER_API_URL = isSandbox
  ? "https://apisandbox.dev.clover.com"
  : "https://api.clover.com";

// Franjas de recogida permitidas (última a la 1pm porque cierran a las 2pm).
const ALLOWED_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getCredentials() {
  const merchantId = isSandbox
    ? process.env.CLOVER_SANDBOX_MERCHANT_ID
    : process.env.CLOVER_MERCHANT_ID;
  const apiToken = isSandbox
    ? process.env.CLOVER_SANDBOX_API_TOKEN
    : process.env.CLOVER_API_TOKEN;
  return { merchantId, apiToken };
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  itemId?: string;
}

function validate(body: any): { valid: boolean; error?: string } {
  if (!Array.isArray(body?.items) || body.items.length === 0) {
    return { valid: false, error: "Your cart is empty." };
  }
  for (const it of body.items as OrderItem[]) {
    if (
      !it ||
      typeof it.name !== "string" ||
      typeof it.price !== "number" ||
      !Number.isFinite(it.price) ||
      it.price < 0 ||
      typeof it.quantity !== "number" ||
      it.quantity < 1 ||
      it.quantity > 99
    ) {
      return { valid: false, error: "One of the items is invalid." };
    }
  }
  const c = body.customer;
  if (!c?.name || typeof c.name !== "string" || c.name.trim().length < 2) {
    return { valid: false, error: "Please enter your name." };
  }
  if (!c?.email || !EMAIL_RE.test(c.email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!body.pickupDate || !body.pickupSlot) {
    return { valid: false, error: "Please choose a pick-up date and time." };
  }
  if (!ALLOWED_SLOTS.includes(body.pickupSlot)) {
    return { valid: false, error: "That pick-up time is not available." };
  }
  // Día de la semana de forma segura (mediodía UTC evita líos de DST).
  const d = new Date(`${body.pickupDate}T12:00:00Z`);
  if (isNaN(d.getTime())) {
    return { valid: false, error: "Invalid pick-up date." };
  }
  if (d.getUTCDay() === 1) {
    return { valid: false, error: "We are closed on Mondays." };
  }
  // No permitir fechas pasadas (comparación de cadenas YYYY-MM-DD).
  const todayStr = new Date().toISOString().slice(0, 10);
  if (body.pickupDate < todayStr) {
    return { valid: false, error: "That pick-up date has already passed." };
  }
  return { valid: true };
}

export async function POST(request: NextRequest) {
  const { merchantId, apiToken } = getCredentials();
  if (!merchantId || !apiToken) {
    return NextResponse.json(
      { error: "Online ordering is not configured yet. Please call the shop." },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const v = validate(body);
  if (!v.valid) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }

  const { items, customer, pickupDate, pickupSlot, notes } = body as {
    items: OrderItem[];
    customer: { name: string; email: string; phone?: string };
    pickupDate: string;
    pickupSlot: string;
    notes?: string;
  };

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Crear la orden con toda la info del cliente en la nota (la ve el POS).
    const note = [
      "ONLINE PICK-UP ORDER",
      `Name: ${customer.name}`,
      `Phone: ${customer.phone || "—"}`,
      `Email: ${customer.email}`,
      `Pick-up: ${pickupDate} at ${pickupSlot}`,
      notes ? `Notes: ${notes}` : null,
      "Payment: pay at pick-up",
    ]
      .filter(Boolean)
      .join("\n");

    const orderRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          state: "open",
          title: `Online pick-up — ${customer.name}`,
          note,
        }),
      }
    );

    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      console.error("[Clover Orders] create order failed:", errorText);
      return NextResponse.json(
        { error: "We could not place your order. Please try again." },
        { status: 502 }
      );
    }

    const order = await orderRes.json();
    const orderId = order.id as string;

    // 2. Añadir cada producto como line item personalizado (sin depender
    //    del inventario). Secuencial para respetar el rate limit de Clover.
    for (const it of items) {
      const lineName =
        it.quantity > 1 ? `${it.name} × ${it.quantity}` : it.name;
      const linePrice = Math.round(it.price * it.quantity * 100); // centavos

      const liRes = await fetch(
        `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}/line_items`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: lineName,
            price: linePrice,
            ...(it.itemId ? { item: { id: it.itemId } } : {}),
          }),
        }
      );

      if (!liRes.ok) {
        const errorText = await liRes.text();
        console.error("[Clover Orders] line item failed:", errorText);
        // La orden ya existe; seguimos con el resto e informamos parcialmente.
      }
    }

    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

    console.log(
      `[Clover Orders] Created ${orderId} for ${customer.name} — pickup ${pickupDate} ${pickupSlot}`
    );

    return NextResponse.json({
      success: true,
      orderId,
      pickup: { date: pickupDate, slot: pickupSlot },
      total,
    });
  } catch (err) {
    console.error("[Clover Orders] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const { merchantId, apiToken } = getCredentials();
  if (!merchantId || !apiToken) {
    return NextResponse.json(
      { error: "Clover not configured" },
      { status: 503 }
    );
  }

  try {
    const orderRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}?expand=lineItems`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!orderRes.ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await orderRes.json();
    return NextResponse.json({
      orderId: order.id,
      state: order.state,
      total: (order.total ?? 0) / 100,
      createdAt: order.createdTime,
      lineItems:
        order.lineItems?.elements?.map((li: any) => ({
          name: li.name,
          price: (li.price ?? 0) / 100,
        })) || [],
    });
  } catch (err) {
    console.error("[Clover Orders GET] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
