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

import { daysBetween, hhmmLabel, hoursForDate, nextDate } from "./hours";

/** "other" = closed with no public reason; the notice just apologises. */
export type ClosureReason = "illness" | "holiday" | "other";

export interface Closure {
  reason: ClosureReason;
  /** Shown in the notice, e.g. the holiday name. */
  label?: string;
  /** First Maine date on which the advance notice is shown. */
  noticeFrom?: string;
  /** First Maine date for the advance popup, when later than the banner (`noticeFrom`). */
  popupFrom?: string;
}

/** Every date from `from` to `until` (inclusive) closed for the same reason. */
function closedRange(from: string, until: string, closure: Closure): Record<string, Closure> {
  const out: Record<string, Closure> = {};
  for (let d = from; d <= until; d = nextDate(d)) out[d] = closure;
  return out;
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
  "2026-11-26": {
    reason: "holiday",
    label: "Thanksgiving Day",
    noticeFrom: "2026-11-16",
  },
  // Christmas break (Valentina's guide, 2026-11-26): closed Dec 24 to Dec 30,
  // back Thursday Dec 31. Banner in Visit from Dec 1, popup from Dec 14.
  ...closedRange("2026-12-24", "2026-12-30", {
    reason: "holiday",
    label: "the Christmas holidays",
    noticeFrom: "2026-12-01",
    popupFrom: "2026-12-14",
  }),
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
  /** Next open day, e.g. "Tuesday · 7 am"; with the date after a multi-day closure. */
  backOn: string;
  /** The next open day is the day after `date`. */
  backNextDay: boolean;
  /** Several closed days in a row (e.g. the Christmas break). */
  isRange: boolean;
  /** "December 24 – 30" for a multi-day closure, otherwise same as longDate. */
  rangeLabel: string;
  /** "December 24 to 30" */
  rangeText: string;
  /** False while only the Visit banner should announce it (before `popupFrom`). */
  popupReady: boolean;
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
  return describeClosure(picked, picked === today, today);
}

/**
 * Closed dates in the seven days starting today, keyed by weekday name
 * ("Thursday" → "Dec 24"), for the weekly hours table.
 */
export function closedWeekdaysAhead(): Map<string, string> {
  const today = maineToday();
  const out = new Map<string, string>();
  for (const date of Object.keys(CLOSED_DATES)) {
    const diff = daysBetween(today, date);
    if (diff < 0 || diff > 6) continue;
    const d = toDate(date);
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(d);
    out.set(fmt({ weekday: "long" }), fmt({ month: "short", day: "numeric" }));
  }
  return out;
}

function describeClosure(date: string, isToday: boolean, today: string): ActiveClosure {
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
  const opens = hhmmLabel(hoursForDate(nextKey).open).replace(/(am|pm)$/, " $1");
  // The whole run of closed days around `date` (one day for a normal closure).
  let first = date;
  for (;;) {
    const prev = new Date(toDate(first).getTime() - 86_400_000).toISOString().slice(0, 10);
    if (!(prev in CLOSED_DATES)) break;
    first = prev;
  }
  const last = new Date(next.getTime() - 86_400_000).toISOString().slice(0, 10);
  const isRange = first !== last;
  const part = (key: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(toDate(key));
  const sameMonth = first.slice(0, 7) === last.slice(0, 7);
  const from = part(first, { month: "long", day: "numeric" });
  const until = sameMonth ? part(last, { day: "numeric" }) : part(last, { month: "long", day: "numeric" });
  const closure = CLOSED_DATES[date];
  const nextLong = part(nextKey, { weekday: "long", month: "long", day: "numeric" });
  return {
    date,
    closure,
    isToday,
    weekday: fmt({ weekday: "long" }),
    longDate: fmt({ weekday: "long", month: "long", day: "numeric" }),
    shortDate: fmt({ month: "short", day: "numeric" }),
    backOn: isRange ? `${nextLong} · ${opens}` : `${nextWeekday} · ${opens}`,
    backNextDay: nextKey === nextDate(date),
    isRange,
    rangeLabel: isRange ? `${from} – ${until}` : fmt({ weekday: "long", month: "long", day: "numeric" }),
    rangeText: isRange ? `${from} to ${until}` : fmt({ weekday: "long", month: "long", day: "numeric" }),
    popupReady: isToday || today >= (closure.popupFrom ?? closure.noticeFrom ?? date),
  };
}

/** Noon UTC so the calendar date never shifts with the viewer's timezone. */
function toDate(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}
