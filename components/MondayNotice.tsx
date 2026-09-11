"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { EdelweissMark } from "./EdelweissMark";

const STORAGE_KEY = "edelweiss_monday_opening_v1";
const OPENING_DATE = new Date("2026-09-14T00:00:00");
// Fires before the welcome modal (4500ms) so this news wins the first slot.
const DELAY_MS = 3000;

/**
 * True while the announcement still has to be shown to this visitor. The
 * welcome modal reads this so the two never stack on top of each other.
 */
export function isMondayNoticePending() {
  if (typeof window === "undefined") return false;
  return !window.localStorage.getItem(STORAGE_KEY);
}

/**
 * Announcement popup: since Mon Sep 14, 2026 the bakery opens seven days a week
 * (Mondays used to be the closed day). Runs indefinitely — shown once per
 * visitor. Delete this component (and its mount in app/page.tsx) when the
 * news has run its course.
 */
export function MondayNotice() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMondayNoticePending()) return;
    const t = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "seen");
    }
  };

  const beforeOpening = new Date() < OPENING_DATE;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="monday-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-cocoa/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="monday-notice-title"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-cocoa text-cream-50 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-forest/40 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-mustard/25 blur-2xl pointer-events-none" />

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
                  New opening days
                </span>
              </div>

              <h2
                id="monday-notice-title"
                className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1] text-cream-50 pr-8"
              >
                We are now open
                <span className="block italic text-mustard">
                  seven days a week.
                </span>
              </h2>

              <p className="mt-4 text-cream-50/75 text-sm leading-relaxed">
                {beforeOpening ? (
                  <>
                    Starting <strong className="text-cream-50">Monday,
                    September 14</strong>, Mondays are no longer our closed day.
                    Same hours as always — and you can already place a Monday
                    pick-up order online.
                  </>
                ) : (
                  <>
                    Mondays are no longer our closed day. Same hours as always,
                    and you can order online for Monday pick-up just like any
                    other day.
                  </>
                )}
              </p>

              <div className="mt-6 rounded-2xl border border-cream-50/15 bg-cream-50/[0.06] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-cream-50/60 uppercase tracking-[0.18em] text-[0.65rem]">
                    Mondays
                  </span>
                  <span className="flex items-center gap-1.5 text-mustard text-xs uppercase tracking-[0.2em]">
                    <CalendarCheck size={11} />
                    Now open
                  </span>
                </div>
                <div className="mt-2 font-display text-2xl text-cream-50">
                  7:00 am – 2:00 pm
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/#shop"
                  onClick={dismiss}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-mustard text-cocoa px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mustard/90 transition-colors"
                >
                  Order for Monday
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full border border-cream-50/25 text-cream-50/80 px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-cream-50/10 hover:text-cream-50 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
