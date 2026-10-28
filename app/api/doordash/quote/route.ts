/**
 * POST /api/doordash/quote
 *
 * Checks whether we can deliver to an address right now and what it costs.
 * Called by the checkout before the customer pays. Books nothing: the real
 * delivery is created by the Clover webhook once the payment is APPROVED.
 *
 * Body: { name, phone, street, unit?, city, zip, subtotalCents }
 * 200:  { ok: true, feeCents, customerFeeCents, pickupEta, dropoffEta, address }
 * 4xx:  { ok: false, error }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  DELIVERY_ENABLED,
  DELIVERY_MIN_ORDER_CENTS,
  DELIVERY_PREP_MINUTES,
  customerDeliveryFeeCents,
  deliveryOrderingStatus,
  deliveryZone,
  formatDeliveryAddress,
  manualDeliveryFeeCents,
  normalizeZip,
} from "@/lib/delivery";
import {
  DOORDASH_ENV,
  createQuote,
  doordashConfigured,
  formatEtaMaine,
  friendlyDoorDashError,
  toE164,
} from "@/lib/doordash";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest) {
  if (!DELIVERY_ENABLED) return fail("Delivery isn't available yet.", 404);
  // Manual mode: no DoorDash API at all. Coverage = our ZIP list, price = the
  // contract's flat fee; staff book the courier in the Merchant Portal.
  const manual = DOORDASH_ENV === "manual";
  if (!manual && !doordashConfigured()) return fail("Delivery isn't set up yet. Please choose pick-up.", 503);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.");
  }

  const street = String(body.street || "").trim();
  const unit = String(body.unit || "").trim();
  const city = String(body.city || "").trim();
  const zip = normalizeZip(String(body.zip || ""));
  const name = String(body.name || "").trim() || "Customer";
  const phone = toE164(String(body.phone || ""));
  const subtotalCents = Number(body.subtotalCents) || 0;

  if (street.length < 3) return fail("Please enter your street address.");
  if (!city) return fail("Please choose your city.");
  if (!deliveryZone(zip)) return fail("Sorry, we don't deliver to that ZIP code yet. You can still reserve a pick-up.");
  if (!/^\+1\d{10}$/.test(phone)) return fail("Please enter a valid US phone number so the driver can reach you.");
  if (subtotalCents < DELIVERY_MIN_ORDER_CENTS) {
    return fail(`Delivery needs a minimum order of $${(DELIVERY_MIN_ORDER_CENTS / 100).toFixed(2)} before tax.`);
  }
  const hours = deliveryOrderingStatus();
  if (!hours.open) return fail(hours.reason || "Delivery isn't available right now.");

  const address = formatDeliveryAddress({ street, unit, city, zip });
  if (manual) {
    const fee = manualDeliveryFeeCents();
    return NextResponse.json({
      ok: true,
      feeCents: fee,
      customerFeeCents: fee,
      pickupEta: formatEtaMaine(new Date(Date.now() + DELIVERY_PREP_MINUTES * 60_000).toISOString()),
      dropoffEta: null,
      address,
    });
  }
  try {
    const quote = await createQuote({
      externalId: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dropoffAddress: address,
      dropoffName: name,
      dropoffPhone: phone,
      orderValueCents: subtotalCents,
    });
    return NextResponse.json({
      ok: true,
      feeCents: quote.feeCents,
      customerFeeCents: customerDeliveryFeeCents(quote.feeCents),
      pickupEta: formatEtaMaine(quote.pickupEta),
      dropoffEta: formatEtaMaine(quote.dropoffEta),
      address,
    });
  } catch (err) {
    console.error("[DoorDash quote] failed:", err);
    return fail(friendlyDoorDashError(err), 400);
  }
}
