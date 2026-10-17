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

// TODO (Valentina): confirm the zone. DoorDash still has the final say: its
// radius is dynamic, and the quote fails for an address it will not serve.
export const DELIVERY_ZONES: { zip: string; city: string }[] = [
  { zip: "04005", city: "Biddeford" },
  { zip: "04006", city: "Biddeford Pool" },
  { zip: "04072", city: "Saco" },
  { zip: "04064", city: "Old Orchard Beach" },
  { zip: "04043", city: "Kennebunk" },
  { zip: "04046", city: "Kennebunkport" },
  { zip: "04046", city: "Arundel" },
  { zip: "04074", city: "Scarborough" },
];

export const DELIVERY_CITIES = Array.from(new Set(DELIVERY_ZONES.map((z) => z.city)));

// TODO (Valentina): minimum order (items only, before tax and fee).
export const DELIVERY_MIN_ORDER_CENTS = 2500;

// TODO (Valentina): how long the kitchen needs before the courier shows up.
export const DELIVERY_PREP_MINUTES = 45;

// TODO (Valentina): when delivery orders are accepted (Maine time, HH:mm).
// Last order at 12:30 so the courier collects well before the 2pm close.
export const DELIVERY_HOURS = { open: "08:00", lastOrder: "12:30" } as const;

// TODO (Valentina): products that must not travel (chocolates are not sold
// online at all, so they never reach here).
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

// TODO (Valentina): decide. Passthrough until then.
export const CUSTOMER_FEE_RULE: CustomerFeeRule = { mode: "passthrough" };

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
