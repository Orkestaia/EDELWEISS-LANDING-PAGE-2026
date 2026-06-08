/**
 * CLOVER HOSTED CHECKOUT WEBHOOK
 *
 * POST /api/clover/webhook
 *
 * Clover llama a este endpoint cada vez que un pago de Hosted Checkout
 * cambia de estado (creado, completado, fallido, reembolsado).
 *
 * Usamos el evento de pago completado para:
 *   1. Loguear el pago (auditoria)
 *   2. Decrementar el stock de los items vendidos (precision 100%)
 *   3. Vincular los line items al inventario para disparar printer labels
 *
 * SEGURIDAD: cada webhook viene firmado con HMAC-SHA256 usando el
 * Signing Secret configurado en el dashboard de Clover. Verificamos
 * la firma antes de procesar; si no coincide, logueamos debug info.
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
function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
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
      console.error(
        `[Webhook] read stock failed for ${itemName} (${itemId})`
      );
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
        body: JSON.stringify({ stockCount: newCount, quantity: newCount }),
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
        `[Webhook] ${itemName}: ${current} -> ${newCount} (-${qty})`
      );
    }
  } catch (err) {
    console.error(`[Webhook] decrement error for ${itemName}:`, err);
  }
}

/** Vincula un line item de la orden a su item de inventario en Clover.
 *  Esto permite que las printer labels de Clover se disparen. */
async function linkLineItemToInventory(
  apiToken: string,
  merchantId: string,
  orderId: string,
  lineItemId: string,
  inventoryItemId: string,
  itemName: string
) {
  try {
    const res = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}/line_items/${lineItemId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: { id: inventoryItemId } }),
      }
    );
    if (res.ok) {
      console.log(
        `[Webhook] linked "${itemName}" line item ${lineItemId} to inventory item ${inventoryItemId}`
      );
    } else {
      const errText = await res.text();
      console.error(
        `[Webhook] link failed for ${itemName}:`,
        res.status,
        errText
      );
    }
  } catch (err) {
    console.error(`[Webhook] link error for ${itemName}:`, err);
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

  // Debug: log ALL headers to find the correct signature header
  const allHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    allHeaders[key] = key.toLowerCase().includes("secret") ? "***" : value;
  });
  console.log("[Webhook] headers:", JSON.stringify(allHeaders));

  const signature =
    request.headers.get("x-clover-signature") ||
    request.headers.get("x-clover-webhook-signature") ||
    request.headers.get("clover-signature") ||
    request.headers.get("signature");

  const signatureValid = verifySignature(rawBody, signature, webhookSecret);

  if (!signatureValid) {
    // Debug: log expected vs received so we can fix the format
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody, "utf8")
      .digest("hex");
    console.warn("[Webhook] signature MISMATCH");
    console.warn("[Webhook] received sig:", signature?.slice(0, 20) + "...");
    console.warn("[Webhook] expected sig:", expected.slice(0, 20) + "...");
    console.warn("[Webhook] secret prefix:", webhookSecret.slice(0, 8) + "...");
    console.warn(
      "[Webhook] PROCESSING ANYWAY (debug mode) — fix signature before go-live"
    );
    // In production, uncomment this to enforce signature:
    // return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  } else {
    console.log("[Webhook] signature verified OK");
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(
    "[Webhook] received:",
    JSON.stringify(payload).slice(0, 500)
  );

  // Eventos relevantes: pago completado.
  const eventType =
    payload.type || payload.eventType || payload.event || "unknown";
  const orderId =
    payload.orderId || payload.order?.id || payload.objectId || null;
  const status =
    payload.status || payload.checkoutStatus || payload.state || null;

  console.log(
    `[Webhook] event=${eventType} status=${status} orderId=${orderId}`
  );

  // Si el pago no se completo, no procesamos.
  const isPaid =
    status === "PAID" ||
    status === "paid" ||
    status === "COMPLETED" ||
    status === "completed" ||
    (eventType.toLowerCase().includes("payment") &&
      eventType.toLowerCase().includes("success"));

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
      console.error(
        "[Webhook] fetch order failed:",
        orderRes.status,
        await orderRes.text()
      );
      return NextResponse.json({ ok: true, error: "fetch order failed" });
    }
    const order = await orderRes.json();
    const lineItems: any[] = order.lineItems?.elements || [];

    console.log(
      `[Webhook] order ${orderId} has ${lineItems.length} line items`
    );

    // Para cada line item:
    // 1. Encontrar el producto por nombre
    // 2. Decrementar stock (si no se hizo ya via decrement-immediate)
    // 3. Vincular al item de inventario (para printer labels)
    for (const li of lineItems) {
      const product = products.find((p) => p.name === li.name);
      if (!product) {
        console.log(
          `[Webhook] no product match for "${li.name}", skipping`
        );
        continue;
      }
      const cloverItemId = effectiveCloverItemId(product);
      if (!cloverItemId) {
        console.log(
          `[Webhook] no cloverItemId for ${product.slug}, skipping`
        );
        continue;
      }

      // Vincular line item al inventario (para printer labels)
      if (li.id) {
        await linkLineItemToInventory(
          apiToken,
          merchantId,
          orderId,
          li.id,
          cloverItemId,
          li.name
        );
      }

      // NOTA: el decrement de stock ya se hace en orders/route.ts (decrement-immediate).
      // NO decrementamos aqui tambien para evitar double-decrement.
      // Si en el futuro cambiamos a webhook-only, descomentar esto:
      // const qty = typeof li.unitQty === "number" && li.unitQty > 0 ? li.unitQty : 1;
      // await decrementStock(apiToken, merchantId, cloverItemId, qty, li.name);
    }

    return NextResponse.json({
      ok: true,
      linked: lineItems.length,
    });
  } catch (err) {
    console.error("[Webhook] unexpected error:", err);
    return NextResponse.json({ ok: true, error: "internal" });
  }
}
