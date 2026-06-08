/**
 * CLOVER HOSTED CHECKOUT WEBHOOK
 *
 * POST /api/clover/webhook
 *
 * Clover calls this endpoint when a Hosted Checkout payment changes
 * status (APPROVED, DECLINED, etc.).
 *
 * On APPROVED we:
 *   1. Log the payment (audit trail)
 *   2. Find the order via the payment ID
 *   3. Link line items to inventory items (triggers printer labels)
 *
 * Stock decrement is handled in orders/route.ts (decrement-immediate).
 *
 * SIGNATURE: Clover signs webhooks with format "t=TIMESTAMP,v1=HMAC".
 * The HMAC is SHA-256 of "TIMESTAMP.BODY" using the Signing Secret.
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

/**
 * Verifies Clover webhook signature.
 * Header format: "t=1780927847,v1=a7be217a..."
 * HMAC is computed over "TIMESTAMP.RAW_BODY" using the signing secret.
 */
function verifySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;

  // Parse t=xxx,v1=yyy
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const [key, ...rest] = part.split("=");
    if (key && rest.length) parts[key.trim()] = rest.join("=").trim();
  }

  const timestamp = parts["t"];
  const receivedSig = parts["v1"];
  if (!timestamp || !receivedSig) {
    console.error("[Webhook] could not parse signature header:", signatureHeader.slice(0, 60));
    return false;
  }

  // Compute HMAC over "timestamp.body"
  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(receivedSig, "hex")
    );
  } catch {
    // Also try without the hcp_ prefix
    const secretClean = secret.startsWith("hcp_") ? secret.slice(4) : secret;
    const expected2 = crypto
      .createHmac("sha256", secretClean)
      .update(payload, "utf8")
      .digest("hex");
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected2, "hex"),
        Buffer.from(receivedSig, "hex")
      );
    } catch {
      return false;
    }
  }
}

/** Links a line item to its inventory item in Clover (enables printer labels). */
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
        `[Webhook] linked "${itemName}" -> inventory ${inventoryItemId}`
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

  const rawBody = await request.text();

  // Get signature from the correct header
  const signatureHeader = request.headers.get("clover-signature");

  const signatureValid = verifySignature(rawBody, signatureHeader, webhookSecret);

  if (!signatureValid) {
    console.warn("[Webhook] signature MISMATCH — processing anyway (debug mode)");
    // TODO: enforce signature before go-live:
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

  console.log("[Webhook] event:", JSON.stringify(payload));

  const eventType = payload.type || "unknown";
  const status = payload.status || null;
  const paymentId = payload.id || null;
  const checkoutSessionId = payload.checkoutSessionId || null;

  console.log(
    `[Webhook] type=${eventType} status=${status} paymentId=${paymentId} sessionId=${checkoutSessionId}`
  );

  // Clover Hosted Checkout sends status "APPROVED" for successful payments
  const isApproved =
    status === "APPROVED" ||
    status === "approved" ||
    status === "PAID" ||
    status === "paid" ||
    status === "COMPLETED" ||
    status === "completed";

  if (!isApproved) {
    console.log(`[Webhook] status "${status}" is not approved, ignoring`);
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!merchantId || !apiToken) {
    console.error("[Webhook] missing credentials");
    return NextResponse.json({ ok: true, error: "missing credentials" });
  }

  // Find the order via the payment ID
  // Clover Hosted Checkout doesn't send orderId directly — we look it up
  let orderId: string | null = null;

  if (paymentId) {
    try {
      const paymentRes = await fetch(
        `${CLOVER_API_URL}/v3/merchants/${merchantId}/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        orderId = paymentData.order?.id || null;
        console.log(
          `[Webhook] payment ${paymentId} -> order ${orderId}`
        );
      } else {
        console.error(
          "[Webhook] fetch payment failed:",
          paymentRes.status,
          await paymentRes.text()
        );
      }
    } catch (err) {
      console.error("[Webhook] fetch payment error:", err);
    }
  }

  if (!orderId) {
    console.error("[Webhook] could not find orderId from payment");
    return NextResponse.json({ ok: true, error: "no orderId found" });
  }

  // Fetch the order with line items
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
      `[Webhook] order ${orderId} has ${lineItems.length} line item(s)`
    );

    // For each line item: find matching product and link to inventory
    let linked = 0;
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

      // Link line item to inventory item (triggers printer labels)
      if (li.id) {
        await linkLineItemToInventory(
          apiToken,
          merchantId,
          orderId,
          li.id,
          cloverItemId,
          li.name
        );
        linked++;
      }

      // NOTE: stock decrement is done in orders/route.ts (decrement-immediate).
      // Do NOT decrement here to avoid double-decrement.
    }

    console.log(`[Webhook] done — linked ${linked}/${lineItems.length} items`);
    return NextResponse.json({ ok: true, linked });
  } catch (err) {
    console.error("[Webhook] unexpected error:", err);
    return NextResponse.json({ ok: true, error: "internal" });
  }
}
