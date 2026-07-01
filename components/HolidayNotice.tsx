"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";

const STORAGE_KEY = "edelweiss_july4_notice_v1";
const SHOW_FROM = new Date("2026-07-01T00:00:00");
const SHOW_UNTIL = new Date("2026-07-04T23:59:59");
const DELAY_MS = 5000;

function isActive() {
  const now = new Date();
  return now >= SHOW_FROM && now <= SHOW_UNTIL;
}

export function HolidayNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isActive()) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
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
      window.localStorage.setItem(STORAGE_KEY, "seen");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="july4-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-cocoa/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="july4-title"
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
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-mustard/30 blur-2xl pointer-events-none" />
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
              <div className="flex items-center gap-2 text-mustard">
                <EdelweissMark size={22} className="text-mustard" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-cream-50/60">
                  Special hours
                </span>
              </div>

              <h2
                id="july4-title"
                className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1] text-cream-50"
              >
                July 4th —
                <span className="block italic text-mustard">
                  we close at noon.
                </span>
              </h2>

              <p className="mt-4 text-cream-50/75 text-sm leading-relaxed">
                This Saturday we'll be open from{" "}
                <strong className="text-cream-50">8:00 am to 12:00 pm</strong>{" "}
                only. It's a family holiday for us too. Orders online are
                capped at the last slot before noon.
              </p>

              <div className="mt-6 rounded-2xl border border-cream-50/15 bg-cream-50/[0.06] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-cream-50/60 uppercase tracking-[0.18em] text-[0.65rem]">
                    July 4th only
                  </span>
                  <span className="flex items-center gap-1.5 text-mustard text-xs uppercase tracking-[0.2em]">
                    <Sparkles size={11} />
                    Independence Day
                  </span>
                </div>
                <div className="mt-2 font-display text-2xl text-cream-50">
                  8:00 am – 12:00 pm
                </div>
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="mt-5 w-full inline-flex items-center justify-center rounded-full bg-mustard text-cocoa px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mustard/90 transition-colors"
              >
                Got it — happy 4th!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
