/**
 * OPENING HOURS — regular weekly hours plus dated exceptions.
 *
 * One place for every "special hours" day (July 4th, short-staffed mornings,
 * Thanksgiving week...). Read by the checkout slot picker, the orders API
 * (server guard), the Visit section banner and the closure popup.
 * Dates are Maine local (YYYY-MM-DD). Past dates do nothing.
 */

export interface DayHours {
  /** HH:mm, Maine time */
  open: string;
  close: string;
}

/** 0 = Sunday … 6 = Saturday. Open seven days since 2026-09-14. */
export const REGULAR_HOURS: Record<number, DayHours> = {
  0: { open: "08:00", close: "14:00" },
  1: { open: "07:00", close: "14:00" },
  2: { open: "07:00", close: "14:00" },
  3: { open: "07:00", close: "14:00" },
  4: { open: "07:00", close: "14:00" },
  5: { open: "07:00", close: "14:00" },
  6: { open: "08:00", close: "14:00" },
};

export interface SpecialHours extends DayHours {
  /** Short reason shown to customers, e.g. "Thanksgiving Eve". */
  label: string;
  /** First Maine date on which the Visit banner announces it. */
  noticeFrom?: string;
  /** Extra line for the banner. */
  note?: string;
}

export const SPECIAL_HOURS: Record<string, SpecialHours> = {
  "2026-07-04": { open: "08:00", close: "12:00", label: "July 4th" },
  "2026-08-04": { open: "08:00", close: "14:00", label: "Short-staffed morning" },
  "2026-08-11": { open: "08:00", close: "14:00", label: "Short-staffed morning" },
  // Thanksgiving week 2026 (menu doc from Valentina, 2026-10-23).
  "2026-11-25": {
    open: "08:00",
    close: "15:00",
    label: "Thanksgiving Eve",
    noticeFrom: "2026-11-16",
    note: "Thanksgiving pre-orders are picked up this day.",
  },
  "2026-11-27": {
    open: "09:00",
    close: "14:00",
    label: "Day after Thanksgiving",
    noticeFrom: "2026-11-16",
  },
};

/** Noon UTC so the calendar date never shifts with the viewer's timezone. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function hoursForDate(date: string): DayHours {
  return SPECIAL_HOURS[date] ?? REGULAR_HOURS[weekdayOf(date)];
}

/**
 * Hourly pick-up slots for a date: from opening until one hour before close
 * (14:00 close → last slot 13:00), the same rule the shop has always used.
 */
export function pickupSlotsForDate(date: string): string[] {
  const { open, close } = hoursForDate(date);
  const start = parseInt(open.slice(0, 2), 10);
  const end = parseInt(close.slice(0, 2), 10) - 1;
  const slots: string[] = [];
  for (let h = start; h <= end; h++) slots.push(`${String(h).padStart(2, "0")}:00`);
  return slots;
}

/** Special-hours days to announce today, soonest first. */
export function upcomingSpecialHours(today: string): (SpecialHours & { date: string })[] {
  return Object.entries(SPECIAL_HOURS)
    .filter(([date, s]) => date >= today && !!s.noticeFrom && s.noticeFrom <= today)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, s]) => ({ date, ...s }));
}

/** "08:00" → "8am", "15:00" → "3pm", "09:30" → "9:30am" */
export function hhmmLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}

export function hoursLabel(h: DayHours): string {
  return `${hhmmLabel(h.open)} – ${hhmmLabel(h.close)}`;
}

/** "2026-11-25" → "Wednesday, November 25" */
export function longDateLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
