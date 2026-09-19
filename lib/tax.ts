/**
 * SALES TAX — shared by the checkout API (what Clover charges) and the UI
 * (what the customer sees), so the two can never disagree.
 *
 * Hosted Checkout line items are not linked to Clover inventory, so Clover
 * does NOT apply the merchant's default tax on its own: we must send it on
 * every line item. Clover rejects the session (404) unless `rate` matches one
 * of the merchant's configured tax rates exactly.
 *
 * The `id` is mandatory in practice: without it the session is created and the
 * payment page even shows the right total, but the payment itself fails with
 * "Something went wrong" (took online sales down Sep 16–19, 2026).
 *
 * Every product sold online is set to "Prepared Food Sales Tax" (8%) in the
 * Clover dashboard. If a product's tax changes there, change it here too.
 */

// Clover format: 10% = 1_000_000, so 8% = 800_000. `id` = merchant tax rate id.
export const SALES_TAX = {
  id: "VAN5DPPXG60Q0",
  name: "Prepared Food Sales Tax",
  rate: 800_000,
} as const;

export const SALES_TAX_PERCENT = SALES_TAX.rate / 100_000;

export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Tax on a subtotal, in cents. Mirrors Clover's own order-total math: items
 * sharing one tax rate are aggregated first, then rounded half up.
 * Pure integer arithmetic to avoid floating-point drift.
 */
export function taxCents(subtotalCents: number): number {
  return Math.floor((subtotalCents * SALES_TAX.rate + 5_000_000) / 10_000_000);
}

export function cartTotals(items: { price: number; quantity: number }[]) {
  const subtotalCents = items.reduce(
    (sum, it) => sum + toCents(it.price) * it.quantity,
    0
  );
  const tax = taxCents(subtotalCents);
  return {
    subtotalCents,
    taxCents: tax,
    totalCents: subtotalCents + tax,
  };
}
