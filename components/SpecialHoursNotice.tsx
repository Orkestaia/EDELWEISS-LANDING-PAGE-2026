"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { isClosedDate, maineToday } from "@/lib/closures";
import {
  activeHoursPopup,
  daysBetween,
  hhmmLabel,
  hoursForDate,
  hoursLabel,
  longDateLabel,
  nextDate,
  pickupSlotsForDate,
  weekdayLabel,
  type SpecialHours,
} from "@/lib/hours";

const DELAY_MS = 1200;

type Notice = SpecialHours & { date: string; isToday: boolean };

function currentNotice(): Notice | null {
  const today = maineToday();
  const s = activeHoursPopup(today);
  return s ? { ...s, isToday: s.date === today } : null;
}

// Seen once as an advance notice and once again on the day itself.
const storageKey = (n: Notice) =>
  `edelweiss_hours_notice_${n.date}_${n.isToday ? "today" : "ahead"}`;

/**
 * True while a special-hours popup still has to be shown. The closure notice
 * and the welcome modal read this so nothing stacks on top of it; they come
 * back on the visitor's next page load.
 */
export function isSpecialHoursNoticePending() {
  if (typeof window === "undefined") return false;
  const n = currentNotice();
  return !!n && !window.localStorage.getItem(storageKey(n));
}

/** Popup for `popup: true` days in lib/hours.ts. Inactive on any other day. */
export function SpecialHoursNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isSpecialHoursNoticePending()) return;
    setNotice(currentNotice());
    const t = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined" && notice) {
      window.localStorage.setItem(storageKey(notice), "seen");
    }
  };

  if (!notice) return null;
  const { date, isToday } = notice;
  const weekday = weekdayLabel(date);
  const isTomorrow = daysBetween(maineToday(), date) === 1;
  const when = isToday ? "Today" : isTomorrow ? "Tomorrow" : weekday;
  const range = `${hhmmLabel(notice.open)} to ${hhmmLabel(notice.close)}`;
  const slots = pickupSlotsForDate(date);
  const lastSlot = slots[slots.length - 1];
  const after = nextDate(date);
  const backToNormal = isClosedDate(after)
    ? null
    : `${weekdayLabel(after)}: back to regular hours, ${hoursLabel(hoursForDate(after))}.`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="special-hours-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-cocoa/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="special-hours-title"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-cocoa text-cream-50 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-mustard/25 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-rust/20 blur-2xl pointer-events-none" />

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 text-cream-50/70 hover:text-cream-50 hover:bg-cream-50/20 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="relative p-7 sm:p-8">
              <div className="flex items-center gap-2">
                <EdelweissMark size={22} className="text-mustard" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-cream-50/60">
                  {isToday ? "Today's hours" : "Heads up · special hours"}
                </span>
              </div>

              <h2
                id="special-hours-title"
                className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1] text-cream-50"
              >
                {when} we&apos;re open
                <span className="block italic text-mustard">{range} only.</span>
              </h2>

              <p className="mt-4 text-cream-50/75 text-sm leading-relaxed">
                {isToday ? (
                  <>
                    Today, {longDateLabel(date)}, the bakery is open from{" "}
                    <strong className="text-cream-50">{range}</strong> only.
                  </>
                ) : (
                  <>
                    On {longDateLabel(date)}, the bakery will be open from{" "}
                    <strong className="text-cream-50">{range}</strong> only.
                  </>
                )}{" "}
                {lastSlot && <>The last online pick-up that day is at {hhmmLabel(lastSlot)}.</>}
              </p>

              <div className="mt-6 rounded-2xl border border-cream-50/15 bg-cream-50/[0.06] p-4 text-sm">
                <span className="flex items-center gap-1.5 text-cream-50/60 uppercase tracking-[0.18em] text-[0.65rem]">
                  <Clock size={11} />
                  {longDateLabel(date)} only
                </span>
                <div className="mt-1 font-display text-2xl text-cream-50">{hoursLabel(notice)}</div>
                {backToNormal && <p className="mt-1 text-cream-50/60 text-xs">{backToNormal}</p>}
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="mt-5 w-full inline-flex items-center justify-center rounded-full bg-mustard text-cocoa px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mustard/90 transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
