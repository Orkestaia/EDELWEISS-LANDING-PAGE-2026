/**
 * THANKSGIVING 2026 PRE-ORDERS
 *
 * A dated block at the top of the home page sells the Thanksgiving menu for
 * pick-up on one fixed day. Items live in lib/products.ts under the category
 * "Thanksgiving" and map to the separate "Thanksgiving ..." items Valentina
 * created in Clover, so their stock never mixes with the everyday bake.
 *
 * Reuse for Christmas: copy the block, change the dates and the products.
 */

import { products, type Product } from "./products";

export const THANKSGIVING = {
  /** First day the block is shown and orders are accepted (Maine date). */
  orderFrom: "2026-10-29",
  /** Last day to order, inclusive. */
  lastOrderDate: "2026-11-20",
  /** Everything is picked up this day. Hours come from lib/hours.ts. */
  pickupDate: "2026-11-25",
  closedDate: "2026-11-26",
  reopenDate: "2026-11-27",
  phone: "207 770-6945",
} as const;

export function thanksgivingOpen(today: string): boolean {
  return today >= THANKSGIVING.orderFrom && today <= THANKSGIVING.lastOrderDate;
}

export function isThanksgivingProduct(p: Product): boolean {
  return p.category === "Thanksgiving";
}

export const thanksgivingProducts = products.filter(isThanksgivingProduct);

const tgSlugs = new Set(thanksgivingProducts.map((p) => p.slug));

export function isThanksgivingSlug(slug?: string): boolean {
  return !!slug && tgSlugs.has(slug);
}

export function cartHasThanksgiving(items: { slug?: string }[]): boolean {
  return items.some((it) => isThanksgivingSlug(it.slug));
}

/** Groups for the block: the table first, then the breakfast pastries. */
export const THANKSGIVING_GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "For the table",
    blurb: "Large desserts and breads, baked the day before so they reach your table fresh.",
    slugs: ["tg-apple-cranberry-tart", "tg-pear-streusel-kuchen", "tg-pumpkin-tart", "tg-dinner-rolls", "tg-rosemary-focaccia"],
  },
  {
    title: "For the morning",
    blurb: "Add a few breakfast pastries for the long weekend. Same pick-up, one order.",
    slugs: ["tg-plain-croissant", "tg-chocolate-croissant", "tg-almond-croissant", "tg-walnut-schnecken", "tg-blueberry-scone"],
  },
];
