"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { SubscribeForm } from "./SubscribeForm";

const STORAGE_KEY = "edelweiss_signup_popup_v1";
const DELAY_MS = 20_000;
// The welcome modal (NewsletterModal) locks body scroll while open. We reuse
// that as the "is a modal already showing?" signal so the two never stack.
const WELCOME_MODAL_KEY = "edelweiss_intro_modal_v2";

/**
 * Newsletter capture popup — a gentle bottom slide-in card (not a full-screen
 * modal) that appears once, after ~20s of browsing. Never overlaps the
 * welcome modal: if that one is still open at the 20s mark, we wait for it to
 * close first. Dismissal is sticky (localStorage) so it never nags twice.
 */
export function SignupPopup() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const welcomeOpen = document.body.style.overflow === "hidden";
      const welcomeStillPending =
        !window.localStorage.getItem(WELCOME_MODAL_KEY) && elapsed < 30_000;
      // Show once 20s have passed AND no modal is currently open AND the
      // welcome modal isn't about to appear.
      if (elapsed >= DELAY_MS && !welcomeOpen && !welcomeStillPending) {
        setOpen(true);
        window.clearInterval(interval);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

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
          key="signup-popup"
          initial={{ opacity: 0, y: reduce ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm sm:left-auto sm:right-6 sm:mx-0"
          role="dialog"
          aria-labelledby="signup-popup-title"
        >
          <div className="relative overflow-hidden rounded-[1.5rem] bg-cream-50 shadow-card border border-cocoa/10 p-6">
            <div
              aria-hidden
              className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-mustard/25 blur-2xl"
            />

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cream-100/90 text-cocoa/70 hover:text-cocoa hover:bg-cream-200 transition-colors"
            >
              <X size={15} />
            </button>

            <div className="relative">
              <div className="flex items-center gap-2.5 text-forest">
                <EdelweissMark size={24} />
                <span className="text-[0.6rem] uppercase tracking-[0.3em]">
                  A gift from us
                </span>
              </div>
              <h2
                id="signup-popup-title"
                className="mt-3 font-display text-2xl text-cocoa leading-[1.1] pr-6"
              >
                A seasonal recipe,
                <span className="italic text-forest"> on the house.</span>
              </h2>
              <p className="mt-2 text-[0.82rem] text-cocoa/65 leading-snug">
                Leave your details for a recipe to bake at home — plus a little
                treat on your birthday.
              </p>

              <div className="mt-4">
                <SubscribeForm tone="light" compact />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
