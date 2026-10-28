/**
 * DELIVERY — business rules for same-day delivery from the website.
 *
 * The customer orders and pays here (Clover, as always); DoorDash Drive only
 * supplies the courier. This file is CLIENT-SAFE (no secrets) and is the single
 * place to change the rules once Valentina confirms them:
 *   zone, minimum order, who pays the courier fee, ordering hours, prep time,
 *   excluded products. Everything else reads from here.
 *
 * Feature flag: NEXT_PUBLIC_DELIVERY_ENABLED=true (unset = the checkout stays
 * pick-up only and the delivery APIs refuse requests).
 */

import { isClosedDate, maineToday } from "./closures";

export const DELIVERY_ENABLED = process.env.NEXT_PUBLIC_DELIVERY_ENABLED === "true";

/** Line item name charged in Clover for the courier. Never a product name. */
export const DELIVERY_LINE_NAME = "Delivery (DoorDash)";

/** Prefix of the Clover note on delivery orders (pick-up uses ONLINE PICK-UP ORDER). */
export const DELIVERY_NOTE_PREFIX = "ONLINE DELIVERY ORDER";

// Meeting 2026-10-17: Valentina wanted roughly 10 miles, but the Drive
// On-Demand terms shown in the Merchant Portal on 2026-10-27 set the delivery
// radius at 5 MILES from the shop. These ZIPs sit inside (or straddle) that
// circle; DoorDash still has the final say per address (the quote fails for
// an address it will not serve). Widen only if DoorDash raises the radius.
export const DELIVERY_ZONES: { zip: string; city: string }[] = [
  { zip: "04005", city: "Biddeford" },
  { zip: "04006", city: "Biddeford Pool" },
  { zip: "04072", city: "Saco" },
  { zip: "04064", city: "Old Orchard Beach" },
];

export const DELIVERY_CITIES = Array.from(new Set(DELIVERY_ZONES.map((z) => z.city)));

// Meeting 2026-10-17: minimum order $10 (items only, before tax and fee).
export const DELIVERY_MIN_ORDER_CENTS = 1000;

// How long the kitchen needs before the courier shows up (to confirm with staff).
export const DELIVERY_PREP_MINUTES = 45;

// Meeting 2026-10-17: start with ONE delivery window, 9am–12pm. Orders are
// accepted from 8:30 (courier at ~9:15) until 11:15 (courier at ~12:00).
// Widen once the first weeks go well.
export const DELIVERY_HOURS = { open: "08:30", lastOrder: "11:15" } as const;
export const DELIVERY_WINDOW_LABEL = "9am–12pm";

// Products that must not travel. Chocolates are not sold online at all, so
// they never reach here. Meeting 2026-10-17: everything else on the site is OK.
export const DELIVERY_EXCLUDED_SLUGS: string[] = [];

/**
 * Who pays the courier. DoorDash quotes a fee per trip (Biddeford → Saco was
 * $9.75 in the sandbox); this decides how much of it the customer sees.
 *   passthrough: customer pays exactly what DoorDash charges.
 *   flat:        customer always pays `cents`, the bakery absorbs the difference.
 *   split:       customer pays `customerCents`, the bakery pays the rest.
 */
export type CustomerFeeRule =
  | { mode: "passthrough" }
  | { mode: "flat"; cents: number }
  | { mode: "split"; customerCents: number };

// Contract (Drive On-Demand Fulfillment Agreement, signed 2026-10-17): flat
// $7.99 per Small Order delivery, billed to the bakery. The customer pays that
// same flat amount until Valentina decides otherwise (sandbox quotes say
// $9.75, but production billing follows the contract).
export const CUSTOMER_FEE_RULE: CustomerFeeRule = { mode: "flat", cents: 799 };

/** Fee charged when the courier is booked by hand (no live DoorDash quote). */
export function manualDeliveryFeeCents(): number {
  return CUSTOMER_FEE_RULE.mode === "flat" ? CUSTOMER_FEE_RULE.cents : 799;
}

// Drive On-Demand agreement, clause 4.5: offer the customer a tip with 15%
// pre-selected. 100% of it goes to the Dasher (staff type it into the
// DoorDash request; with the API it is sent as `tip`). It is its own untaxed
// line on the Clover order, so it never counts as bakery revenue.
export const DRIVER_TIP_LINE_NAME = "Driver tip (DoorDash)";
export const TIP_PERCENT_OPTIONS = [0, 10, 15, 20] as const;
export const DEFAULT_TIP_PERCENT = 15;

export function isValidTipPercent(p: unknown): p is number {
  return typeof p === "number" && (TIP_PERCENT_OPTIONS as readonly number[]).includes(p);
}

/** Tip on the pastry subtotal (after any reward discount), in cents. */
export function driverTipCents(itemsCents: number, percent: number): number {
  return Math.round((itemsCents * percent) / 100);
}

export function customerDeliveryFeeCents(quotedCents: number): number {
  switch (CUSTOMER_FEE_RULE.mode) {
    case "flat":
      return CUSTOMER_FEE_RULE.cents;
    case "split":
      return Math.min(quotedCents, CUSTOMER_FEE_RULE.customerCents);
    default:
      return quotedCents;
  }
}

export interface DeliveryAddress {
  street: string;
  unit?: string;
  city: string;
  zip: string;
}

export function normalizeZip(zip: string): string {
  return (zip || "").replace(/\D/g, "").slice(0, 5);
}

export function deliveryZone(zip: string) {
  const z = normalizeZip(zip);
  return DELIVERY_ZONES.find((d) => d.zip === z) || null;
}

/** "5 Alfred St, Ste 103, Biddeford, ME 04005" — what DoorDash and the POS see. */
export function formatDeliveryAddress(a: DeliveryAddress): string {
  const unit = a.unit?.trim();
  return `${a.street.trim()}${unit ? `, ${unit}` : ""}, ${a.city.trim()}, ME ${normalizeZip(a.zip)}`;
}

/** Current Maine time as HH:mm. */
export function maineNowHHMM(now = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

/** HH:mm in Maine for `minutes` from now. */
export function maineTimePlus(minutes: number, now = new Date()): string {
  return maineNowHHMM(new Date(now.getTime() + minutes * 60_000));
}

/** Whether a delivery order can be placed right now (Maine time, open days only). */
export function deliveryOrderingStatus(now = new Date()): { open: boolean; reason?: string } {
  // Local testing outside ordering hours. Never honoured in production builds.
  if (process.env.NODE_ENV !== "production" && process.env.DELIVERY_TEST_IGNORE_HOURS === "true") {
    return { open: true };
  }
  if (isClosedDate(maineToday())) {
    return { open: false, reason: "We're closed today, so there are no deliveries. Please order for pick-up another day." };
  }
  const hhmm = maineNowHHMM(now);
  if (hhmm < DELIVERY_HOURS.open) {
    return { open: false, reason: `Delivery orders open at ${pretty(DELIVERY_HOURS.open)}. You can still reserve a pick-up.` };
  }
  if (hhmm > DELIVERY_HOURS.lastOrder) {
    return { open: false, reason: `Delivery orders close at ${pretty(DELIVERY_HOURS.lastOrder)} so the courier reaches you before we close. You can still reserve a pick-up.` };
  }
  return { open: true };
}

export function pretty(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}
