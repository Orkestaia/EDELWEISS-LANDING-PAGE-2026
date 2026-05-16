"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight, Mail } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";

const STORAGE_KEY = "edelweiss_recipe_modal_v1";
const DELAY_MS = 4500;

export function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "subscribed");
    }
    window.setTimeout(() => setOpen(false), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="newsletter-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-cocoa/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-modal-title"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 20, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-cream-50 shadow-card border border-cocoa/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-mustard/25 blur-2xl" />
            <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-forest/15 blur-3xl" />

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-cocoa/70 hover:text-cocoa hover:bg-cream-200 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="relative grid grid-cols-1 sm:grid-cols-5">
              {/* Left art */}
              <div className="sm:col-span-2 relative bg-forest-50 paper p-8 sm:p-10 flex flex-col justify-between min-h-[180px] sm:min-h-0">
                <EdelweissMark size={56} className="animate-floaty" />
                <div>
                  <div className="text-[0.65rem] uppercase tracking-[0.32em] text-forest">
                    From our kitchen to yours
                  </div>
                  <div className="mt-2 font-display text-2xl sm:text-3xl text-cocoa leading-tight">
                    A Swiss recipe,
                    <span className="block italic text-forest">
                      on the house.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right form */}
              <div className="sm:col-span-3 p-8 sm:p-10">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2
                        id="newsletter-modal-title"
                        className="font-display text-3xl sm:text-4xl text-cocoa leading-[1.1]"
                      >
                        Get your first Edelweiss recipe — instantly.
                      </h2>
                      <p className="mt-4 text-sm sm:text-base text-cocoa/70 leading-relaxed">
                        Leave us your email and we will send a Swiss-inspired
                        recipe straight from our bakery in Biddeford. Occasional
                        notes on seasonal pastries and exclusive subscriber
                        offers. No spam — pastry only.
                      </p>

                      <form
                        onSubmit={onSubmit}
                        className="mt-6 flex flex-col gap-3"
                      >
                        <label
                          htmlFor="modal-email"
                          className="text-[0.65rem] uppercase tracking-[0.24em] text-cocoa/60"
                        >
                          Email address
                        </label>
                        <div className="relative">
                          <Mail
                            size={15}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/50"
                          />
                          <input
                            id="modal-email"
                            type="email"
                            required
                            placeholder="you@inbox.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            className="w-full rounded-full bg-cream-100 border border-cocoa/10 pl-11 pr-5 py-3.5 text-sm text-cocoa placeholder:text-cocoa/40 focus:outline-none focus:border-rust focus:bg-cream-50 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-cocoa text-cream-50 px-6 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-rust transition-colors"
                        >
                          Send me the recipe
                          <ArrowRight
                            size={15}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={dismiss}
                          className="self-start mt-1 text-[0.7rem] uppercase tracking-[0.22em] text-cocoa/55 hover:text-cocoa"
                        >
                          No thanks, take me to the menu
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="thanks"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="h-full min-h-[200px] flex flex-col items-center justify-center text-center"
                    >
                      <div className="font-display italic text-3xl text-forest">
                        Merci vielmal!
                      </div>
                      <p className="mt-4 max-w-sm text-cocoa/70">
                        Check your inbox — your first Swiss recipe is on its
                        way. See you at the bakery soon.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
