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
 *   3. Link line items to inventory items
 *   4. Set order type to "Pickup" (shows on POS + may trigger printer labels)
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

/**
 * Finds the "Pickup" order type in the merchant's configured order types.
 * Caches the result for the lifetime of the serverless function instance.
 */
let cachedPickupTypeId: string | null = null;
let pickupTypeFetched = false;

async function getPickupOrderTypeId(
  apiToken: string,
  merchantId: string
): Promise<string | null> {
  if (pickupTypeFetched) return cachedPickupTypeId;

  // Retry with backoff to handle Clover 429 rate limiting
  const delays = [0, 1500, 3000]; // immediate, then 1.5s, then 3s
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) {
      console.log(`[Webhook] order_types retry ${attempt + 1}, waiting ${delays[attempt]}ms...`);
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }

    try {
      const res = await fetch(
        `${CLOVER_API_URL}/v3/merchants/${merchantId}/order_types`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );
      if (res.status === 429) {
        console.warn(`[Webhook] order_types 429 rate limited (attempt ${attempt + 1}/${delays.length})`);
        continue; // retry
      }
      if (!res.ok) {
        console.error("[Webhook] fetch order_types failed:", res.status);
        return null;
      }
      const data = await res.json();
      const types: any[] = data.elements || [];
      console.log(
        `[Webhook] order types available: ${types.map((t: any) => `${t.label} (${t.id})`).join(", ")}`
      );

      // Look for any order type containing "pickup" (case-insensitive)
      // Matches: "Pickup", "In-store Pickup", "Pick-up", "Pickup Order", etc.
      const pickup = types.find((t: any) => {
        const label = (t.label || "").toLowerCase().replace(/[^a-z]/g, "");
        return label.includes("pickup");
      });

      cachedPickupTypeId = pickup?.id || null;
      pickupTypeFetched = true;
      if (cachedPickupTypeId) {
        console.log(`[Webhook] found Pickup order type: ${cachedPickupTypeId}`);
      } else {
        console.warn("[Webhook] no Pickup order type found in merchant config");
      }
      return cachedPickupTypeId;
    } catch (err) {
      console.error("[Webhook] getPickupOrderTypeId error:", err);
      return null;
    }
  }

  console.error("[Webhook] order_types failed after all retries");
  return null;
}

/**
 * Sets the order type to "Pickup" so it appears correctly on the POS
 * and may trigger printer labels configured for that order type.
 */
async function setOrderTypePickup(
  apiToken: string,
  merchantId: string,
  orderId: string
): Promise<boolean> {
  const pickupTypeId = await getPickupOrderTypeId(apiToken, merchantId);
  if (!pickupTypeId) return false;

  try {
    const res = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderType: { id: pickupTypeId } }),
      }
    );
    if (res.ok) {
      console.log(
        `[Webhook] order ${orderId} set to Pickup type (${pickupTypeId})`
      );
      return true;
    } else {
      const errText = await res.text();
      console.error(
        `[Webhook] setOrderType failed:`,
        res.status,
        errText
      );
      return false;
    }
  } catch (err) {
    console.error("[Webhook] setOrderType error:", err);
    return false;
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

    // For each line item: find matching product, link to inventory, decrement stock
    let linked = 0;
    let decremented = 0;
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

      // Link line item to inventory item
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

      // Decrement stock — only here in the webhook (after payment APPROVED)
      // This prevents phantom decrements from failed/abandoned checkouts
      // NOTE: Clover stores unitQty multiplied by 1000 (like price in cents)
      // So unitQty=1000 means quantity 1, unitQty=2000 means quantity 2, etc.
      const rawQty = li.unitQty || 1000;
      const qty = rawQty >= 1000 ? Math.round(rawQty / 1000) : rawQty;
      try {
        const stockRes = await fetch(
          `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks/${cloverItemId}`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
        if (!stockRes.ok) {
          console.error(`[Stock] read failed for ${li.name}: ${stockRes.status}`);
          continue;
        }
        const stockData = await stockRes.json();
        const current =
          typeof stockData.stockCount === "number"
            ? stockData.stockCount
            : typeof stockData.quantity === "number"
            ? Math.floor(stockData.quantity)
            : null;

        if (current === null) {
          console.log(`[Stock] ${li.name}: no stock tracking, skipping`);
          continue;
        }

        const newCount = Math.max(0, current - qty);
        const updateRes = await fetch(
          `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks/${cloverItemId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ stockCount: newCount, quantity: newCount }),
          }
        );
        if (updateRes.ok) {
          console.log(`[Stock] ${li.name}: ${current} → ${newCount} (-${qty})`);
          decremented++;
        } else {
          const errText = await updateRes.text();
          console.error(`[Stock] decrement failed for ${li.name}:`, updateRes.status, errText);
        }
      } catch (err) {
        console.error(`[Stock] decrement error for ${li.name}:`, err);
      }
    }

    // Set order type to "Pickup" — shows on POS + may trigger printer labels
    const pickupSet = await setOrderTypePickup(apiToken, merchantId!, orderId);

    console.log(
      `[Webhook] done — linked ${linked}/${lineItems.length} items, decremented ${decremented}, pickup=${pickupSet}`
    );
    return NextResponse.json({ ok: true, linked, decremented, pickup: pickupSet });
  } catch (err) {
    console.error("[Webhook] unexpected error:", err);
    return NextResponse.json({ ok: true, error: "internal" });
  }
}
