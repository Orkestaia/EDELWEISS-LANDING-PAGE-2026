/**
 * CHRISTMAS 2026 PRE-ORDERS
 *
 * Same idea as lib/thanksgiving.ts: a dated block at the top of the home page
 * sells the Christmas menu for pick-up on one fixed day. Items live in
 * lib/products.ts under the category "Christmas" and map to the "Christmas ..."
 * items in Clover (Valentina's guide, 2026-11-26).
 *
 * Closed days and special hours around the holidays are in lib/closures.ts and
 * lib/hours.ts; the dates here only drive the pre-order block and checkout.
 */

import { products, type Product } from "./products";

export const CHRISTMAS = {
  /** First day the block is shown and orders are accepted (Maine date). */
  orderFrom: "2026-11-26",
  /** Last day to order, inclusive (Thursday). */
  lastOrderDate: "2026-12-17",
  /** Everything is picked up this day (Wednesday). Hours come from lib/hours.ts. */
  pickupDate: "2026-12-23",
  /** Closed for the holidays, both inclusive. */
  closedFrom: "2026-12-24",
  closedUntil: "2026-12-30",
  reopenDate: "2026-12-31",
  newYearDate: "2027-01-01",
  phone: "207 770-6945",
} as const;

export function christmasOpen(today: string): boolean {
  return today >= CHRISTMAS.orderFrom && today <= CHRISTMAS.lastOrderDate;
}

export function isChristmasProduct(p: Product): boolean {
  return p.category === "Christmas";
}

export const christmasProducts = products.filter(isChristmasProduct);

const xmasSlugs = new Set(christmasProducts.map((p) => p.slug));

export function isChristmasSlug(slug?: string): boolean {
  return !!slug && xmasSlugs.has(slug);
}

export function cartHasChristmas(items: { slug?: string }[]): boolean {
  return items.some((it) => isChristmasSlug(it.slug));
}

/**
 * Groups for the block. Valentina's menu lists Desserts, Breads and Breakfast;
 * desserts and breads share one group so the grid fills two even rows.
 */
export const CHRISTMAS_GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "For the table",
    blurb: "Christmas breads, large desserts, rolls and focaccia, ready to share at the table.",
    slugs: [
      "xmas-stollen",
      "xmas-panettone",
      "xmas-pear-streusel-kuchen",
      "xmas-apple-cranberry-tart",
      "xmas-dinner-rolls",
      "xmas-rosemary-focaccia",
    ],
  },
  {
    title: "For Christmas morning",
    blurb: "Add a few breakfast pastries for Christmas morning. Same pick-up, one order.",
    slugs: [
      "xmas-plain-croissant",
      "xmas-chocolate-croissant",
      "xmas-almond-croissant",
      "xmas-blueberry-scone",
      "xmas-nuss-schnecken",
    ],
  },
];
