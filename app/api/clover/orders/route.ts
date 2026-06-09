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
import { products, effectiveCloverItemId } from "@/lib/products";

const isSandbox = process.env.NEXT_PUBLIC_ENV === "sandbox";
const CLOVER_API_URL = isSandbox
  ? "https://apisandbox.dev.clover.com"
  : "https://api.clover.com";
const CHECKOUT_URL = isSandbox
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
  const ecommerceToken = isSandbox
    ? process.env.CLOVER_SANDBOX_ECOMMERCE_TOKEN
    : process.env.CLOVER_ECOMMERCE_TOKEN;
  return { merchantId, apiToken, ecommerceToken };
}

interface OrderItem {
  slug?: string;
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
  const { merchantId, apiToken, ecommerceToken } = getCredentials();
  if (!merchantId || !apiToken || !ecommerceToken) {
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

  // Resolver el Clover item ID para cada producto (si está mapeado).
  // Usamos el slug que envía el frontend para buscar en `lib/products`.
  const itemsWithIds = items.map((it) => {
    const product = it.slug
      ? products.find((p) => p.slug === it.slug)
      : undefined;
    const cloverItemId = product ? effectiveCloverItemId(product) : undefined;
    return { ...it, cloverItemId };
  });

  // VALIDACIÓN DE STOCK: para cada producto con item ID, consultamos el stock
  // actual en Clover y rechazamos si no hay suficiente. Esto evita sobreventa.
  try {
    const stockChecks = await Promise.all(
      itemsWithIds
        .filter((it) => it.cloverItemId)
        .map(async (it) => {
          const r = await fetch(
            `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks/${it.cloverItemId}`,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );
          if (!r.ok) return { name: it.name, available: null as number | null };
          const data = await r.json();
          const available =
            typeof data.stockCount === "number"
              ? data.stockCount
              : typeof data.quantity === "number"
              ? Math.floor(data.quantity)
              : null;
          return { name: it.name, requested: it.quantity, available };
        })
    );

    const oversold = stockChecks.find(
      (s) =>
        typeof s.available === "number" &&
        typeof (s as any).requested === "number" &&
        s.available < (s as any).requested
    );
    if (oversold) {
      return NextResponse.json(
        {
          error: `Sorry, ${oversold.name} only has ${oversold.available} left for today. Please adjust your order.`,
        },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("[Clover Orders] stock check failed:", err);
    // No bloqueamos el pedido si la validación falla (red, timeout, etc).
    // Clover lo bloqueará igualmente en producción si Allow negative = OFF.
  }

  try {
    // Una única orden: la crea automáticamente Clover Hosted Checkout al pagar.
    // Toda la info de pickup va como "note" para que aparezca en el POS junto al pago.
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const origin = request.nextUrl.origin;
    const firstName = customer.name.split(" ")[0];
    const lastName = customer.name.split(" ").slice(1).join(" ") || firstName;

    const pickupNote = [
      "ONLINE PICK-UP ORDER",
      `Pick-up: ${pickupDate} at ${pickupSlot}`,
      `Phone: ${customer.phone || "—"}`,
      notes ? `Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const checkoutPayload = {
      customer: {
        email: customer.email,
        firstName,
        lastName,
        ...(customer.phone ? { phoneNumber: customer.phone } : {}),
      },
      shoppingCart: {
        lineItems: itemsWithIds.map((it) => ({
          name: it.name,
          unitQty: it.quantity,
          price: Math.round(it.price * 100),
          note: pickupNote,
        })),
      },
      redirectUrl: `${origin}/checkout/confirm`,
    };

    console.log("[Clover Checkout] payload:", JSON.stringify(checkoutPayload));

    const checkoutEndpoint = `${CHECKOUT_URL}/invoicingcheckoutservice/v1/checkouts`;
    const checkoutRes = await fetch(checkoutEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ecommerceToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Clover-Merchant-Id": merchantId,
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!checkoutRes.ok) {
      const errText = await checkoutRes.text();
      console.error("[Clover Checkout] failed — status:", checkoutRes.status);
      console.error("[Clover Checkout] url:", checkoutEndpoint);
      console.error("[Clover Checkout] token prefix:", ecommerceToken?.slice(0, 8));
      console.error("[Clover Checkout] body:", errText);
      return NextResponse.json(
        { error: "Could not start the payment session. Please try again." },
        { status: 502 }
      );
    }

    const checkoutData = await checkoutRes.json();
    const checkoutUrl: string = checkoutData.href;
    const checkoutSessionId: string | undefined = checkoutData.checkoutSessionId;

    console.log(
      `[Clover Orders] Session ${checkoutSessionId} for ${customer.name} — pickup ${pickupDate} ${pickupSlot}`
    );

    // Stock decrement is now handled in the webhook (only after APPROVED payment).
    // This avoids phantom decrements when payment fails or customer abandons checkout.

    return NextResponse.json({
      checkoutUrl,
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
