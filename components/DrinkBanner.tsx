"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const MENU_URL =
  "https://drive.google.com/file/d/1zXOSjPxExbGZkb-YMzzgotYySDg4CFQi/view?usp=sharing";

export function DrinkBanner() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Cold drinks menu"
      className="relative isolate overflow-hidden bg-cocoa"
    >
      {/* Background drink photo — tinted warm */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/products/drink2.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/80 to-cocoa/30" />
      </div>

      {/* Right-side drink close-up — decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 lg:w-2/5 hidden md:block"
      >
        <Image
          src="/images/products/drink3.png"
          alt=""
          fill
          sizes="40vw"
          className="object-cover opacity-60"
          style={{ objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-mustard" />
              New this summer
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-cream-50 leading-[1.05]">
              Cool down with our
              <span className="block italic text-mustard">cold drinks.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-cream-50/75 text-base sm:text-lg leading-relaxed max-w-sm">
              Hibiscus iced teas, lemonades, and seasonal cold brews — made
              in-house with the same care as everything else we bake.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="shrink-0">
          <motion.a
            href={MENU_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="inline-flex items-center gap-3 rounded-full border-2 border-cream-50 text-cream-50 px-7 py-4 text-sm uppercase tracking-[0.22em] hover:bg-cream-50 hover:text-cocoa transition-colors"
          >
            View drinks menu
            <ArrowUpRight size={16} />
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
