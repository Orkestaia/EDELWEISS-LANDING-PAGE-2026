/**
 * CLOSURES — single source of truth for days the bakery is closed.
 *
 * Shared by the checkout date picker, the orders API (server-side guard), the
 * closure popup and the Visit section. Dates are Maine local dates
 * (YYYY-MM-DD). Past dates do nothing, so entries never need cleaning up.
 *
 * `noticeFrom` (optional) makes the popup + Visit banner announce the closure
 * in advance from that date. Without it, the notice only shows on the day.
 */

/** "other" = closed with no public reason; the notice just apologises. */
export type ClosureReason = "illness" | "holiday" | "other";

export interface Closure {
  reason: ClosureReason;
  /** Shown in the notice, e.g. the holiday name. */
  label?: string;
  /** First Maine date on which the advance notice is shown. */
  noticeFrom?: string;
}

export const CLOSED_DATES: Record<string, Closure> = {
  // Alex & Valentina were sick — shop closed, no pick-ups.
  "2026-10-05": { reason: "illness" },
  // Indigenous Peoples' Day — announced from Friday the 9th.
  "2026-10-12": {
    reason: "holiday",
    label: "Indigenous Peoples' Day",
    noticeFrom: "2026-10-09",
  },
  // Closed Wednesday Oct 28 (Valentina, 2026-10-27, no public reason) — announced from Tuesday.
  "2026-10-28": { reason: "other", noticeFrom: "2026-10-27" },
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

export interface ActiveClosure {
  date: string;
  closure: Closure;
  isToday: boolean;
  /** "Monday" */
  weekday: string;
  /** "Monday, October 12" */
  longDate: string;
  /** "Oct 12" */
  shortDate: string;
  /** Next open day, e.g. "Tuesday · 7:00 am" */
  backOn: string;
}

/**
 * The closure to announce right now: today's closure if the shop is closed
 * today, otherwise the nearest upcoming closure whose `noticeFrom` has been
 * reached. Null when there is nothing to say.
 */
export function activeClosure(): ActiveClosure | null {
  const today = maineToday();
  const dates = Object.keys(CLOSED_DATES).sort();
  let picked: string | null = null;
  if (today in CLOSED_DATES) {
    picked = today;
  } else {
    picked =
      dates.find((d) => {
        const c = CLOSED_DATES[d];
        return d > today && !!c.noticeFrom && c.noticeFrom <= today;
      }) ?? null;
  }
  if (!picked) return null;
  return describeClosure(picked, picked === today);
}

function describeClosure(date: string, isToday: boolean): ActiveClosure {
  const d = toDate(date);
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(d);
  // Find the next day that is not closed.
  let next = toDate(date);
  let nextKey = date;
  do {
    next = new Date(next.getTime() + 86_400_000);
    nextKey = next.toISOString().slice(0, 10);
  } while (nextKey in CLOSED_DATES);
  const nextWeekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
  }).format(next);
  const opens = nextWeekday === "Saturday" || nextWeekday === "Sunday" ? "8:00 am" : "7:00 am";
  return {
    date,
    closure: CLOSED_DATES[date],
    isToday,
    weekday: fmt({ weekday: "long" }),
    longDate: fmt({ weekday: "long", month: "long", day: "numeric" }),
    shortDate: fmt({ month: "short", day: "numeric" }),
    backOn: `${nextWeekday} · ${opens}`,
  };
}

/** Noon UTC so the calendar date never shifts with the viewer's timezone. */
function toDate(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}
