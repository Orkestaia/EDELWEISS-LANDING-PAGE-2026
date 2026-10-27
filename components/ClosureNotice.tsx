"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { activeClosure, type ActiveClosure } from "@/lib/closures";

const DELAY_MS = 1200;
// Seen once as an advance notice and once again on the day itself.
const storageKey = (c: ActiveClosure) =>
  `edelweiss_closed_notice_${c.date}_${c.isToday ? "today" : "ahead"}`;

/**
 * True while a closure popup (today's, or an announced upcoming one) still
 * has to be shown. The other popups (Monday news, welcome modal) read this so
 * nothing stacks on top of it.
 */
export function isClosureNoticePending() {
  if (typeof window === "undefined") return false;
  const c = activeClosure();
  return !!c && !window.localStorage.getItem(storageKey(c));
}

/** Popup for closures listed in lib/closures.ts. Inactive on any other day. */
export function ClosureNotice() {
  const [closure, setClosure] = useState<ActiveClosure | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isClosureNoticePending()) return;
    setClosure(activeClosure());
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
    if (typeof window !== "undefined" && closure) {
      window.localStorage.setItem(storageKey(closure), "seen");
    }
  };

  if (!closure) return null;
  const { isToday, weekday, longDate, backOn, closure: info } = closure;
  const holiday = info.reason === "holiday";
  const illness = info.reason === "illness";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="closure-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-cocoa/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="closure-title"
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
                  {isToday ? "Today's update" : "Heads up"}
                </span>
              </div>

              <h2
                id="closure-title"
                className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1] text-cream-50"
              >
                {isToday ? (
                  <>
                    We&apos;re closed
                    <span className="block italic text-mustard">today, {weekday}.</span>
                  </>
                ) : (
                  <>
                    Closed on
                    <span className="block italic text-mustard">{longDate}.</span>
                  </>
                )}
              </h2>

              <p className="mt-4 text-cream-50/75 text-sm leading-relaxed">
                {holiday ? (
                  isToday ? (
                    <>
                      It&apos;s {info.label}, so the bakery is{" "}
                      <strong className="text-cream-50">closed today</strong> and there are
                      no pick-ups. Enjoy the long weekend!
                    </>
                  ) : (
                    <>
                      The bakery will be <strong className="text-cream-50">closed on {longDate}</strong>{" "}
                      for {info.label}, so there are no pick-ups that day. Online orders for
                      any other day are open as usual.
                    </>
                  )
                ) : illness ? (
                  <>
                    Alex and Valentina are feeling under the weather, so for health
                    reasons the bakery is <strong className="text-cream-50">closed today</strong>{" "}
                    and there are no pick-ups. Thank you for understanding.
                  </>
                ) : isToday ? (
                  <>
                    The bakery is <strong className="text-cream-50">closed today</strong> and
                    there are no pick-ups. Sorry for the inconvenience, and thank you for
                    understanding.
                  </>
                ) : (
                  <>
                    The bakery will be <strong className="text-cream-50">closed on {longDate}</strong>,
                    so there are no pick-ups that day. Sorry for the inconvenience. Online
                    orders for any other day are open as usual.
                  </>
                )}
              </p>

              <div className="mt-6 rounded-2xl border border-cream-50/15 bg-cream-50/[0.06] p-4 text-sm">
                <span className="text-cream-50/60 uppercase tracking-[0.18em] text-[0.65rem]">
                  {isToday ? "Back tomorrow" : "Back on"}
                </span>
                <div className="mt-1 font-display text-2xl text-cream-50">{backOn}</div>
                <p className="mt-1 text-cream-50/60 text-xs">
                  {isToday
                    ? "Online orders for pick-up from tomorrow are open."
                    : "Every other day we're open as usual."}
                </p>
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="mt-5 w-full inline-flex items-center justify-center rounded-full bg-mustard text-cocoa px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mustard/90 transition-colors"
              >
                {illness ? "Got it, get well soon!" : "Got it, thanks!"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
