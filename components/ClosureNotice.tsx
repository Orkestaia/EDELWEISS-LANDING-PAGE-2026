"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { isClosedToday, maineToday } from "@/lib/closures";

const DELAY_MS = 1200;
const storageKey = () => `edelweiss_closed_notice_${maineToday()}`;

/**
 * True while today's closure popup still has to be shown. The other popups
 * (Monday news, welcome modal) read this so nothing stacks on top of it.
 */
export function isClosureNoticePending() {
  if (typeof window === "undefined") return false;
  return isClosedToday() && !window.localStorage.getItem(storageKey());
}

/** Popup shown on days listed in lib/closures.ts. Inactive on any other day. */
export function ClosureNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isClosureNoticePending()) return;
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
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey(), "seen");
    }
  };

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
                  Today&apos;s update
                </span>
              </div>

              <h2
                id="closure-title"
                className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1] text-cream-50"
              >
                We&apos;re closed
                <span className="block italic text-mustard">today, Monday.</span>
              </h2>

              <p className="mt-4 text-cream-50/75 text-sm leading-relaxed">
                Alex and Valentina are feeling under the weather, so for health
                reasons the bakery is <strong className="text-cream-50">closed today</strong> and
                there are no pick-ups. Thank you for understanding.
              </p>

              <div className="mt-6 rounded-2xl border border-cream-50/15 bg-cream-50/[0.06] p-4 text-sm">
                <span className="text-cream-50/60 uppercase tracking-[0.18em] text-[0.65rem]">
                  Back tomorrow
                </span>
                <div className="mt-1 font-display text-2xl text-cream-50">
                  Tuesday · 7:00 am
                </div>
                <p className="mt-1 text-cream-50/60 text-xs">
                  Online orders for pick-up from Tuesday are open.
                </p>
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="mt-5 w-full inline-flex items-center justify-center rounded-full bg-mustard text-cocoa px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mustard/90 transition-colors"
              >
                Got it, get well soon!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
