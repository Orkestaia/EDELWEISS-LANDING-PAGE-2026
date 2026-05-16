"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { products, productCategories } from "@/lib/products";
import { Reveal } from "./Reveal";

export function Showcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof productCategories)[number]>("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="shop" className="relative bg-cream-50 paper">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
                <span className="w-8 h-px bg-rust" />
                The Window
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cocoa leading-[1.05] max-w-2xl">
                Today on the
                <span className="italic text-forest"> counter.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="max-w-md text-cocoa/75">
            <p className="text-lg leading-relaxed">
              A curated selection from this week&apos;s bake. Tap any pastry to
              reserve yours for pick-up — quantities are limited and they leave
              quickly.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-2 sm:gap-3">
            {productCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase border transition-all ${
                  active === c
                    ? "bg-cocoa text-cream-50 border-cocoa"
                    : "border-cocoa/20 text-cocoa/70 hover:border-cocoa/50 hover:text-cocoa"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.ul
          layout
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                transition={{
                  duration: 0.55,
                  delay: (i % 6) * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative"
              >
                <a
                  href="#order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-cream-100 shadow-soft">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-cocoa/0 to-cocoa/0 opacity-90 group-hover:from-cocoa/70 transition-colors" />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-cream-50/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cocoa">
                      {p.category}
                    </span>
                    <span className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/95 text-cocoa transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight size={16} />
                    </span>
                    <div className="absolute inset-x-5 bottom-5 text-cream-50">
                      <h3 className="font-display text-2xl leading-tight">
                        {p.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-cream-50/85 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
            <a
              href="#order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-8 py-4 text-sm uppercase tracking-[0.22em] hover:bg-rust transition-colors"
            >
              Reserve the full menu on Clover
              <ArrowUpRight size={16} />
            </a>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-cocoa/55">
              In-store pick-up · Tuesday through Sunday
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
