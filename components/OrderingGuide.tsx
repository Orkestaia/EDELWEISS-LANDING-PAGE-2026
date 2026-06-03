"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Clock, ShoppingBag, Award, Truck } from "lucide-react";
import { Reveal } from "./Reveal";
import { AlpineSilhouette } from "./AlpineBackground";

type Item = {
  icon: React.ReactNode;
  title: string;
  short: string;
  body: string;
};

const items: Item[] = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Scheduling your pick-up",
    short: "Every hour · Tue – Sun",
    body:
      "Our system assigns pick-ups in 1-hour increments. Need a specific time inside that window? Drop it into the Special Instructions field at checkout and we will hold it for you.",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Ordering large quantities",
    short: "Online limits apply",
    body:
      "Each item has a per-order cap online so we can plan the bake fairly. For bigger numbers — events, offices, weddings — give us a call and we will bypass the limit and prepare the order together.",
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Loyalty program & rewards",
    short: "In-store only",
    body:
      "Our loyalty points are earned and redeemed in person at the counter — just share your phone number when you pick up. Online orders do not currently accrue or redeem rewards.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Delivery status",
    short: "Pick-up only — for now",
    body:
      "We are pick-up only at the moment so every pastry leaves the bakery at its peak. Delivery is on the roadmap — sign up to our newsletter and you will be the first to know.",
  },
];

const quickRef = [
  ["Pick-Up Time", "Hourly slots — note specific times in Special Instructions"],
  ["Bulk Orders", "Online caps apply · Call us to bypass"],
  ["Loyalty Points", "Earned & redeemed in-person at the counter"],
  ["Delivery", "Not available yet — in-store pick-up only"],
];

export function OrderingGuide() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="ordering"
      className="relative isolate bg-cocoa text-cream-50 overflow-hidden"
    >
      {/* Alpine train backdrop — warm sunset viaduct, very faint, tinted to
          cocoa so the copy stays perfectly legible. The motif the founders
          love, woven into the page texture. */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/heritage/alps-viaduct-sunset.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa via-cocoa/80 to-cocoa" />
      </div>

      <AlpineSilhouette
        tone="forest"
        className="absolute inset-x-0 bottom-0 w-full h-72 opacity-25"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-mustard" />
              Ordering guide
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              How to order from
              <span className="block italic text-mustard">our online store.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-cream-50/75 text-lg leading-relaxed max-w-md">
              Shopping with us is easy. Five things to know before you place
              your order — so the moment you walk in, your bag is already
              packed.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 rounded-2xl border border-cream-50/15 p-6 bg-cream-50/[0.04]">
              <div className="text-xs uppercase tracking-[0.3em] text-mustard mb-4">
                Quick reference
              </div>
              <dl className="space-y-3">
                {quickRef.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-3 gap-4 text-sm border-b border-cream-50/10 last:border-0 pb-3 last:pb-0"
                  >
                    <dt className="col-span-1 text-cream-50/60 uppercase tracking-[0.18em] text-[0.7rem] mt-0.5">
                      {k}
                    </dt>
                    <dd className="col-span-2 text-cream-50/90">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <ul className="divide-y divide-cream-50/15">
            {items.map((it, i) => {
              const expanded = open === i;
              return (
                <Reveal key={it.title} delay={i * 0.06} as="li">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    className="w-full flex items-start gap-5 sm:gap-7 py-7 sm:py-8 text-left group"
                    aria-expanded={expanded}
                  >
                    <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-50/25 text-mustard group-hover:border-mustard transition-colors">
                      {it.icon}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-2xl sm:text-3xl text-cream-50">
                          {it.title}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-mustard hidden sm:inline">
                          {it.short}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.span
                            key="body"
                            initial={{
                              height: 0,
                              opacity: 0,
                              y: reduce ? 0 : -4,
                            }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              y: reduce ? 0 : -4,
                            }}
                            transition={{
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="block overflow-hidden"
                          >
                            <span className="block pt-4 max-w-2xl text-cream-50/80 text-base sm:text-lg leading-relaxed">
                              {it.body}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <motion.span
                      animate={{ rotate: expanded ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream-50/25 text-cream-50"
                      aria-hidden
                    >
                      <Plus size={16} />
                    </motion.span>
                  </button>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
