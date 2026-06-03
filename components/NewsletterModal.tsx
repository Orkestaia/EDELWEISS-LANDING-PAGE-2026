"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ShoppingBag, Clock, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { EdelweissMark } from "./EdelweissMark";

const STORAGE_KEY = "edelweiss_intro_modal_v2";
const DELAY_MS = 4500;

const steps = [
  {
    icon: <ShoppingBag size={15} />,
    title: "Pick your pastries",
    body: "Browse our menu and add what you love to your order.",
  },
  {
    icon: <Clock size={15} />,
    title: "Choose your pick-up time",
    body: "Hourly slots, Tuesday through Sunday, 7 am – 2 pm.",
  },
  {
    icon: <Calendar size={15} />,
    title: "Pay online & confirm",
    body: "Secure checkout. You will get an email confirmation right away.",
  },
  {
    icon: <MapPin size={15} />,
    title: "Walk in, walk out",
    body: "Just show your name at the counter. Your bag will be ready.",
  },
];

/**
 * Welcome popup — shows once per visitor (localStorage gated). Used to be a
 * recipe-signup form; now it is a friendly 4-step intro on how to order.
 * Dismiss is sticky so it never bothers the same visitor twice.
 */
export function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
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
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-cocoa/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-modal-title"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 20, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-cream-50 shadow-card border border-cocoa/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-mustard/25 blur-2xl" />
            <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-forest/15 blur-3xl" />

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-cocoa/70 hover:text-cocoa hover:bg-cream-200 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="relative p-7 sm:p-10">
              {/* Header */}
              <div className="flex items-center gap-3 text-forest">
                <EdelweissMark size={32} />
                <span className="text-[0.65rem] uppercase tracking-[0.32em]">
                  Welcome · Grüezi
                </span>
              </div>
              <h2
                id="intro-modal-title"
                className="mt-5 font-display text-3xl sm:text-[2.4rem] text-cocoa leading-[1.08]"
              >
                Ordering from us
                <span className="block italic text-forest">
                  is this simple.
                </span>
              </h2>
              <p className="mt-3 text-sm text-cocoa/65 leading-relaxed">
                Everything is baked fresh that morning. Here is how it works in
                four small steps.
              </p>

              {/* Steps */}
              <ol className="mt-7 space-y-4">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest font-display text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-cocoa">
                        <span className="text-forest/80">{s.icon}</span>
                        <span className="font-display text-lg leading-tight">
                          {s.title}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-cocoa/70 leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#shop"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-rust transition-colors"
                >
                  Start your order
                </Link>
                <Link
                  href="/menu"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 rounded-full border border-cocoa/20 text-cocoa px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-cocoa hover:text-cream-50 transition-colors"
                >
                  Just browse the menu
                </Link>
              </div>
              <p className="mt-5 text-[0.7rem] text-cocoa/50">
                Pick-up only · Tue–Sun, 7 am – 2 pm · 5 Alfred Street, Biddeford
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
