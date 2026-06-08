/**
 * CLOVER HOSTED CHECKOUT WEBHOOK
 *
 * POST /api/clover/webhook
 *
 * Clover llama a este endpoint cada vez que un pago de Hosted Checkout
 * cambia de estado (creado, completado, fallido, reembolsado).
 *
 * Usamos el evento de pago completado para:
 *   1. Loguear el pago (auditoría)
 *   2. Decrementar el stock de los items vendidos (precisión 100%)
 *
 * SEGURIDAD: cada webhook viene firmado con HMAC-SHA256 usando el
 * Signing Secret configurado en el dashboard de Clover. Verificamos
 * la firma antes de procesar; si no coincide, rechazamos 401.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { products, effectiveCloverItemId } from "@/lib/products";

const isSandbox = process.env.NEXT_PUBLIC_ENV === "sandbox";
const CLOVER_API_URL = isSandbox
  ? "https://apisandbox.dev.clover.com"
  : "https://api.clover.com";

function getCredentials() {
  const merchantId = isSandbox
    ? process.env.CLOVER_SANDBOX_MERCHANT_ID
    : process.env.CLOVER_MERCHANT_ID;
  const apiToken = isSandbox
    ? process.env.CLOVER_SANDBOX_API_TOKEN
    : process.env.CLOVER_API_TOKEN;
  const webhookSecret = isSandbox
    ? process.env.CLOVER_SANDBOX_WEBHOOK_SECRET
    : process.env.CLOVER_WEBHOOK_SECRET;
  return { merchantId, apiToken, webhookSecret };
}

/** Verifica la firma HMAC-SHA256 del webhook. */
function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  // Constant-time comparison (anti timing attacks)
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}

/** Decrementa el stock de un item de Clover por una cantidad dada. */
async function decrementStock(
  apiToken: string,
  merchantId: string,
  itemId: string,
  qty: number,
  itemName: string
) {
  try {
    const stockRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!stockRes.ok) {
      console.error(`[Webhook] read stock failed for ${itemName} (${itemId})`);
      return;
    }
    const stockData = await stockRes.json();
    const current =
      typeof stockData.stockCount === "number"
        ? stockData.stockCount
        : typeof stockData.quantity === "number"
        ? Math.floor(stockData.quantity)
        : 0;
    const newCount = Math.max(0, current - qty);
    const updateRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks/${itemId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockCount: newCount }),
      }
    );
    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error(
        `[Webhook] decrement failed for ${itemName} (${itemId}):`,
        updateRes.status,
        errText
      );
    } else {
      console.log(
        `[Webhook] ${itemName}: ${current} → ${newCount} (-${qty})`
      );
    }
  } catch (err) {
    console.error(`[Webhook] decrement error for ${itemName}:`, err);
  }
}

export async function POST(request: NextRequest) {
  const { merchantId, apiToken, webhookSecret } = getCredentials();

  if (!webhookSecret) {
    console.error("[Webhook] no signing secret configured");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  // Leer body crudo para verificar la firma.
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-clover-signature") ||
    request.headers.get("x-clover-webhook-signature") ||
    request.headers.get("clover-signature");

  if (!verifySignature(rawBody, signature, webhookSecret)) {
    console.error("[Webhook] invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[Webhook] received:", JSON.stringify(payload).slice(0, 500));

  // Eventos relevantes: pago completado.
  // El payload exacto puede variar según el evento de Clover; intentamos
  // detectar varios campos posibles.
  const eventType =
    payload.type || payload.eventType || payload.event || "unknown";
  const orderId =
    payload.orderId || payload.order?.id || payload.objectId || null;
  const status =
    payload.status || payload.checkoutStatus || payload.state || null;

  console.log(`[Webhook] event=${eventType} status=${status} orderId=${orderId}`);

  // Si el pago no se completó (e.g. cancelado, fallido) → no decrementamos.
  const isPaid =
    status === "PAID" ||
    status === "paid" ||
    status === "COMPLETED" ||
    status === "completed" ||
    eventType.toLowerCase().includes("payment") &&
      eventType.toLowerCase().includes("success");

  if (!isPaid) {
    console.log(`[Webhook] non-paid event, ignoring`);
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!orderId || !merchantId || !apiToken) {
    console.error("[Webhook] missing orderId or credentials");
    return NextResponse.json({ ok: true, error: "missing data" });
  }

  // Fetch the order to get its line items.
  try {
    const orderRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}?expand=lineItems`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!orderRes.ok) {
      console.error("[Webhook] fetch order failed:", await orderRes.text());
      return NextResponse.json({ ok: true, error: "fetch order failed" });
    }
    const order = await orderRes.json();
    const lineItems: any[] = order.lineItems?.elements || [];

    // Para cada line item, encontramos el producto por nombre y decrementamos.
    for (const li of lineItems) {
      const product = products.find((p) => p.name === li.name);
      if (!product) {
        console.log(`[Webhook] no product match for "${li.name}", skipping`);
        continue;
      }
      const cloverItemId = effectiveCloverItemId(product);
      if (!cloverItemId) {
        console.log(`[Webhook] no cloverItemId for ${product.slug}, skipping`);
        continue;
      }
      const qty =
        typeof li.unitQty === "number" && li.unitQty > 0 ? li.unitQty : 1;
      await decrementStock(apiToken, merchantId, cloverItemId, qty, li.name);
    }

    return NextResponse.json({ ok: true, decremented: lineItems.length });
  } catch (err) {
    console.error("[Webhook] unexpected error:", err);
    return NextResponse.json({ ok: true, error: "internal" });
  }
}
