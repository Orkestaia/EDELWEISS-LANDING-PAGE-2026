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
 *   3. Send the n8n order-notification email
 *   4. Decrement stock (batched per item, with 429 retry)
 *   5. Set order type to "Pickup" (shows on POS)
 *
 * NOTE (2026-07-11): the old "link line items to inventory" step was removed.
 * Clover returns 200 for that POST on locked orders but silently ignores it
 * (verified: the item ref never persists), so it only burned rate-limit
 * budget and produced false-positive logs. Printer labels need the
 * iFrame+API migration anyway.
 *
 * SIGNATURE: Clover signs webhooks with format "t=TIMESTAMP,v1=HMAC".
 * The HMAC is SHA-256 of "TIMESTAMP.BODY" using the Signing Secret.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { products, effectiveCloverItemId } from "@/lib/products";

// Give this route more time than Vercel's default (was silently truncating
// the webhook mid-execution on slow runs — see [Webhook] timeout note below).
export const maxDuration = 30;

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
  // Skip the lookup (and its 429 retries) entirely if the ID is already known.
  // Find it once from the "[Webhook] found Pickup order type: XXXX" log line,
  // then set CLOVER_PICKUP_ORDER_TYPE_ID in Vercel env vars.
  const knownId = process.env.CLOVER_PICKUP_ORDER_TYPE_ID;
  if (knownId) return knownId;

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sets the order type to "Pickup" so it appears correctly on the POS
 * and may trigger printer labels configured for that order type.
 *
 * This used a bare `fetch` with no retry until 2026-07-22. Root-caused a
 * ~50% silent failure rate on real orders (confirmed via Clover API: 6 of
 * 12 paid online orders since Jul 15 never got orderType set) — Clover
 * intermittently 429s this call after the preceding payment/order/stock
 * calls have already used up the merchant's rate-limit budget, and since
 * the webhook always returns 200 regardless, Clover never retries.
 * Now uses the same cloverFetchWithRetry used for stock decrement.
 */
async function setOrderTypePickup(
  apiToken: string,
  merchantId: string,
  orderId: string
): Promise<boolean> {
  const pickupTypeId = await getPickupOrderTypeId(apiToken, merchantId);
  if (!pickupTypeId) return false;

  const res = await cloverFetchWithRetry(
    `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderType: { id: pickupTypeId } }),
    },
    `setOrderType ${orderId}`
  );

  if (res && res.ok) {
    console.log(`[Webhook] order ${orderId} set to Pickup type (${pickupTypeId})`);
    return true;
  }
  const errText = res ? await res.text() : "no response after retries";
  console.error(`[Webhook] setOrderType failed:`, res?.status, errText);
  return false;
}

/**
 * Clover fetch with retry on 429/5xx. Clover throttles rapid successive
 * calls (especially writes to the same resource), which used to silently
 * kill stock decrements. 3 attempts: immediate, +600ms, +1800ms.
 */
async function cloverFetchWithRetry(
  url: string,
  init: RequestInit,
  label: string
): Promise<Response | null> {
  const delays = [0, 600, 1800];
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await sleep(delays[attempt]);
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || res.status >= 500) {
        console.warn(`[Clover] ${label}: HTTP ${res.status} (attempt ${attempt + 1}/${delays.length})`);
        continue;
      }
      return res;
    } catch (err) {
      console.error(`[Clover] ${label}: network error (attempt ${attempt + 1})`, err);
    }
  }
  console.error(`[Clover] ${label}: failed after all retries`);
  return null;
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
    console.error("[Webhook] invalid signature — rejecting");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  console.log("[Webhook] signature verified OK");

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

    // Send order notification to n8n → email to Edelweiss FIRST, before the
    // slower/rate-limited steps below. This is the most time-critical step
    // for the bakery (they need to know a pickup order came in) — if the
    // function gets cut off by Vercel's execution time limit later on (e.g.
    // Clover 429s during order-type lookup), the email must already be sent.
    try {
      // Parse pickup note from first line item to extract customer details
      const firstNote: string = lineItems[0]?.note || "";
      const noteFields: Record<string, string> = {};
      for (const part of firstNote.split(" | ")) {
        const colonIdx = part.indexOf(": ");
        if (colonIdx > 0) {
          noteFields[part.slice(0, colonIdx).trim()] = part.slice(colonIdx + 2).trim();
        }
      }

      const pickupRaw = noteFields["Pick-up"] || "";
      const [pickupDate, pickupTime] = pickupRaw.includes(" at ")
        ? pickupRaw.split(" at ")
        : [pickupRaw, ""];

      const n8nPayload = {
        orderId,
        customerName: noteFields["Customer"] || "Online Customer",
        customerEmail: noteFields["Email"] || "",
        customerPhone: noteFields["Phone"] || "",
        pickupDate: pickupDate.trim(),
        pickupTime: pickupTime.trim(),
        notes: noteFields["Notes"] || "",
        items: lineItems.map((li: any) => ({
          name: li.name,
          qty: li.unitQty >= 1000 ? Math.round(li.unitQty / 1000) : (li.unitQty || 1),
          price: `$${((li.price || 0) / 100).toFixed(2)}`,
        })),
        total: `$${(lineItems.reduce((s: number, li: any) => {
          const q = li.unitQty >= 1000 ? Math.round(li.unitQty / 1000) : (li.unitQty || 1);
          return s + (li.price || 0) * q;
        }, 0) / 100).toFixed(2)}`,
      };

      console.log("[Webhook] sending n8n notification:", JSON.stringify(n8nPayload));

      const n8nRes = await fetch(
        "https://acgrowthmarketing.app.n8n.cloud/webhook/edelweiss-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(n8nPayload),
          // Hard cap: a slow/cold n8n must not eat the time budget that the
          // stock decrement below needs. n8n queues the email on receipt,
          // so even a timeout here usually still delivers the email.
          signal: AbortSignal.timeout(8000),
        }
      );
      console.log(`[Webhook] n8n response: ${n8nRes.status}`);
    } catch (err) {
      // Don't fail the webhook if n8n notification fails
      console.error("[Webhook] n8n notification error:", err);
    }

    // ---- STOCK DECREMENT (batched per Clover item) ----
    // The old version did read+write per LINE ITEM. Orders often carry the
    // same product as multiple line items (e.g. 3x "Plain Croissant" = 3
    // separate line items), and Clover deterministically rejects rapid
    // successive writes to the same item_stock — so only the first write
    // survived and the rest were silently lost (bug found 2026-07-11).
    // Now: aggregate quantities per item first → exactly ONE read and ONE
    // write per distinct product, each with retry.
    const qtyByItem = new Map<string, { qty: number; name: string }>();
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
      // Clover stores unitQty multiplied by 1000 (like price in cents)
      const rawQty = li.unitQty || 1000;
      const qty = rawQty >= 1000 ? Math.round(rawQty / 1000) : rawQty;
      const prev = qtyByItem.get(cloverItemId);
      qtyByItem.set(cloverItemId, {
        qty: (prev?.qty || 0) + qty,
        name: li.name,
      });
    }

    let decremented = 0;
    let first = true;
    for (const [cloverItemId, { qty, name }] of qtyByItem) {
      // Small gap between distinct items to stay under Clover's rate limits
      if (!first) await sleep(300);
      first = false;

      const authHeaders = {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      };
      const stockUrl = `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks/${cloverItemId}`;

      const stockRes = await cloverFetchWithRetry(
        stockUrl,
        { headers: authHeaders, cache: "no-store" },
        `stock read ${name}`
      );
      if (!stockRes || !stockRes.ok) {
        console.error(`[Stock] read failed for ${name}: ${stockRes?.status ?? "no response"}`);
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
        console.log(`[Stock] ${name}: no stock tracking, skipping`);
        continue;
      }

      const newCount = Math.max(0, current - qty);
      const updateRes = await cloverFetchWithRetry(
        stockUrl,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ stockCount: newCount, quantity: newCount }),
        },
        `stock write ${name}`
      );
      if (updateRes && updateRes.ok) {
        console.log(`[Stock] ${name}: ${current} → ${newCount} (-${qty})`);
        decremented++;
      } else {
        const errText = updateRes ? await updateRes.text() : "no response";
        console.error(`[Stock] decrement failed for ${name}:`, updateRes?.status, errText);
      }
    }

    // Set order type to "Pickup" — shows on POS.
    // Runs last: it's the slowest, most rate-limited step (Clover 429s on
    // order_types), and email + stock must not depend on it.
    const pickupSet = await setOrderTypePickup(apiToken, merchantId!, orderId);

    console.log(
      `[Webhook] done — decremented ${decremented}/${qtyByItem.size} distinct items, pickup=${pickupSet}`
    );
    return NextResponse.json({
      ok: true,
      decremented,
      distinctItems: qtyByItem.size,
      pickup: pickupSet,
    });
  } catch (err) {
    console.error("[Webhook] unexpected error:", err);
    return NextResponse.json({ ok: true, error: "internal" });
  }
}
