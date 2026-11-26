/**
 * DATED PRE-ORDER EVENTS (Thanksgiving, Christmas...)
 *
 * One lookup for the checkout page, the cart and the orders API: "does this
 * cart contain items from a pre-order menu, and which one?". Such a cart is
 * picked up on the event's fixed day, pick-up only.
 */

import { THANKSGIVING, cartHasThanksgiving, thanksgivingOpen } from "./thanksgiving";
import { CHRISTMAS, cartHasChristmas, christmasOpen } from "./christmas";

export interface PreorderEvent {
  key: "thanksgiving" | "christmas";
  /** "Thanksgiving" / "Christmas", used in headings, errors and the order note. */
  name: string;
  /** Fixed pick-up day (Maine date). */
  pickupDate: string;
  /** Whether orders are still accepted on this Maine date. */
  isOpen: (today: string) => boolean;
}

const EVENTS: { event: PreorderEvent; inCart: (items: { slug?: string }[]) => boolean }[] = [
  {
    event: {
      key: "christmas",
      name: "Christmas",
      pickupDate: CHRISTMAS.pickupDate,
      isOpen: christmasOpen,
    },
    inCart: cartHasChristmas,
  },
  {
    event: {
      key: "thanksgiving",
      name: "Thanksgiving",
      pickupDate: THANKSGIVING.pickupDate,
      isOpen: thanksgivingOpen,
    },
    inCart: cartHasThanksgiving,
  },
];

/** The pre-order event this cart belongs to, or null for an everyday order. */
export function cartPreorder(items: { slug?: string }[]): PreorderEvent | null {
  return EVENTS.find((e) => e.inCart(items))?.event ?? null;
}

/** The pre-order event taking orders right now (for the cart hint), or null. */
export function openPreorder(today: string): PreorderEvent | null {
  return EVENTS.find((e) => e.event.isOpen(today))?.event ?? null;
}
