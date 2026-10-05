/**
 * UNPLANNED CLOSURES — single source of truth for days the bakery is closed.
 *
 * Shared by the checkout date picker, the orders API (server-side guard), the
 * closure popup and the Visit section. Dates are Maine local dates
 * (YYYY-MM-DD). Past dates do nothing, so entries never need cleaning up.
 */

export const CLOSED_DATES: Record<string, string> = {
  // Alex & Valentina are sick — shop closed, no pick-ups.
  "2026-10-05": "illness",
};

/** Today's date in Maine (America/New_York) as YYYY-MM-DD. */
export function maineToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isClosedDate(date: string): boolean {
  return date in CLOSED_DATES;
}

export function isClosedToday(): boolean {
  return isClosedDate(maineToday());
}
