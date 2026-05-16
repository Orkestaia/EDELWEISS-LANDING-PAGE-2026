"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { AlpinePeaks } from "./AlpineBackground";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-cream-50 paper"
    >
      <AlpinePeaks className="hidden md:block absolute right-[-4rem] top-24 w-[520px] text-forest/15" />
      <AlpinePeaks className="md:hidden absolute right-[-3rem] top-28 w-[280px] text-forest/15" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 text-forest"
            >
              <EdelweissMark size={28} />
              <span className="uppercase tracking-[0.32em] text-[0.7rem] sm:text-xs">
                Swiss bakery · est. Biddeford, Maine
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.95,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 font-display text-[2.85rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem] text-cocoa"
            >
              A little corner of
              <span className="block italic text-forest">the Swiss Alps</span>
              baked fresh on Main Street.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.95,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-cocoa/75"
            >
              Hand-laminated croissants, slow-fermented breads, century-old
              Swiss recipes and small-batch chocolates. Baked daily, with
              hospitality served the way our grandparents would.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.95,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#order"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-rust transition-colors"
              >
                Order for pick-up
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 text-cocoa px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-cocoa hover:text-cream-50 transition-colors"
              >
                See the menu
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="mt-12 grid grid-cols-3 max-w-md text-cocoa/70"
            >
              <div>
                <div className="font-display text-3xl text-forest">72h</div>
                <div className="text-xs uppercase tracking-widest mt-1">
                  Cold ferment
                </div>
              </div>
              <div className="border-x border-cocoa/15 px-4">
                <div className="font-display text-3xl text-forest">100%</div>
                <div className="text-xs uppercase tracking-widest mt-1">
                  Butter laminated
                </div>
              </div>
              <div className="pl-4">
                <div className="font-display text-3xl text-forest">Daily</div>
                <div className="text-xs uppercase tracking-widest mt-1">
                  Baked at dawn
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-card"
            >
              <Image
                src="/images/products/chocolate-tart.jpg"
                alt="Edelweiss chocolate and cocoa nib tart"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/30 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-cream-50">
                <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-80">
                  Signature
                </div>
                <div className="font-display text-2xl mt-1">
                  Chocolate · Cocoa Nib Tart
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute -left-6 -bottom-6 lg:-left-10 lg:-bottom-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-mustard/95 shadow-soft animate-floaty"
            >
              <div className="h-full w-full grid place-items-center text-cocoa text-center px-4">
                <div>
                  <div className="text-[0.6rem] uppercase tracking-[0.3em]">
                    Pick up
                  </div>
                  <div className="font-display text-lg leading-tight mt-1">
                    Tue – Sun
                  </div>
                  <div className="text-[0.65rem] mt-1">7am · 2pm</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
