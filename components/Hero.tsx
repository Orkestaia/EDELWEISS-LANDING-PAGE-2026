"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { AlpinePeaks } from "./AlpineBackground";

/**
 * HERO — readable, mobile-first, with a hand-laminated croissant centre piece
 * orbited by a few signature products that gently float (Apple-style "hero").
 *
 * Design decisions (post-feedback):
 *  - No text overlaid on photos → legibility on mobile.
 *  - The yellow "PICK UP" badge moved off the croissant (was covering text).
 *  - Scroll-pinned animation removed — didn't work on mobile (screen too short).
 *    A subtle continuous float on each product carries the "alive" feeling
 *    without requiring scroll.
 *  - On mobile: 3 floating products around the croissant. On desktop: 5.
 *  - All copy lives on the cream paper background (full contrast guaranteed).
 */

interface FloatingItem {
  src: string;
  alt: string;
  /** Tailwind classes for positioning + size + responsive visibility */
  pos: string;
  /** Delay (seconds) for the float animation so they don't move in sync */
  delay: number;
  /** Float amplitude in px */
  amp?: number;
  /** Optional gentle rotation in deg */
  rotate?: number;
}

const floatingProducts: FloatingItem[] = [
  // Top-left (hidden on small phones)
  {
    src: "/images/products/nuss-schnecken.jpg",
    alt: "Nuss Schnecken — Swiss nut spiral",
    pos: "hidden sm:block top-[2%] left-[-6%] w-[22%] sm:w-[18%] lg:w-[20%]",
    delay: 0,
    amp: 10,
    rotate: -6,
  },
  // Top-right (visible always)
  {
    src: "/images/chocolates/truffle-trio.jpg",
    alt: "Swiss chocolate truffles",
    pos: "top-[1%] right-[-5%] w-[28%] sm:w-[22%] lg:w-[22%]",
    delay: 1.2,
    amp: 14,
    rotate: 5,
  },
  // Middle-left (visible always — small)
  {
    src: "/images/products/almond-croissant.jpg",
    alt: "Almond croissant",
    pos: "top-[42%] left-[-8%] w-[26%] sm:w-[20%] lg:w-[19%]",
    delay: 2.0,
    amp: 12,
    rotate: -4,
  },
  // Bottom-right (visible always)
  {
    src: "/images/products/berliner.jpg",
    alt: "Berliner — raspberry-filled doughnut",
    pos: "bottom-[6%] right-[-4%] w-[24%] sm:w-[18%] lg:w-[18%]",
    delay: 0.6,
    amp: 11,
    rotate: 7,
  },
  // Bottom-left (hidden on small phones)
  {
    src: "/images/products/spitzbub.jpg",
    alt: "Spitzbub — Swiss raspberry shortbread",
    pos: "hidden sm:block bottom-[12%] left-[3%] w-[14%] sm:w-[12%] lg:w-[13%]",
    delay: 1.8,
    amp: 9,
    rotate: 10,
  },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-cream-50 paper"
    >
      {/* Decorative Alpine peaks (very subtle, behind everything) */}
      <AlpinePeaks className="hidden md:block absolute right-[-4rem] top-24 w-[520px] text-forest/10" />
      <AlpinePeaks className="md:hidden absolute right-[-3rem] top-28 w-[280px] text-forest/10" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ───── LEFT: copy on cream (always readable) ───── */}
          <div className="lg:col-span-6 relative z-10 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center lg:justify-start gap-3 text-forest"
            >
              <EdelweissMark size={26} />
              <span className="uppercase tracking-[0.3em] text-[0.65rem] sm:text-xs">
                Hand-laminated · Baked daily · Biddeford, Maine
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[5rem] text-cocoa"
            >
              Swiss-inspired
              <span className="block italic text-forest">bakery in Maine.</span>
              <span className="block">Baked daily, by hand.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto lg:mx-0 mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-cocoa/75"
            >
              Hand-laminated croissants, slow-fermented Swiss breads,
              century-old pastries and small-batch chocolates — made from
              scratch in our downtown Biddeford bakery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <a
                href="#shop"
                className="group inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-6 sm:px-7 py-3.5 text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-rust transition-colors"
              >
                Order for pick-up
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 text-cocoa px-6 sm:px-7 py-3.5 text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-cocoa hover:text-cream-50 transition-colors"
              >
                See the menu
              </Link>
            </motion.div>

            {/* Stats / pick-up info — no longer floating on top of an image */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="mt-12 grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 text-cocoa/75"
            >
              <div>
                <dt className="text-[0.6rem] uppercase tracking-[0.25em] mt-1">
                  Trained in
                </dt>
                <dd className="font-display text-2xl sm:text-3xl text-forest">
                  Switzerland
                </dd>
              </div>
              <div className="border-x border-cocoa/15 px-3">
                <dt className="text-[0.6rem] uppercase tracking-[0.25em] mt-1">
                  Pick-up
                </dt>
                <dd className="font-display text-2xl sm:text-3xl text-forest">
                  Tue – Sun
                </dd>
              </div>
              <div className="pl-3">
                <dt className="text-[0.6rem] uppercase tracking-[0.25em] mt-1">
                  Hours
                </dt>
                <dd className="font-display text-2xl sm:text-3xl text-forest">
                  7 – 2
                </dd>
              </div>
            </motion.dl>
          </div>

          {/* ───── RIGHT: croissant centre piece + floating products ───── */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-[28rem] sm:max-w-[34rem] lg:max-w-[38rem]">
              {/* Soft halo behind the centre piece */}
              <div
                aria-hidden
                className="absolute inset-[12%] rounded-full bg-mustard/20 blur-3xl"
              />

              {/* Centre piece: the cut croissant (the hero product) */}
              <motion.div
                initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[8%] sm:inset-[6%]"
              >
                <div
                  className={`relative h-full w-full ${
                    reduce ? "" : "animate-floaty"
                  }`}
                >
                  <Image
                    src="/images/products/hero-croissant-cut.jpg"
                    alt="Hand-laminated butter croissant cut open to reveal honeycomb crumb and dozens of buttery layers"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>

              {/* Floating products around the centre */}
              {floatingProducts.map((p, i) => (
                <motion.div
                  key={p.src + i}
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.5 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`absolute ${p.pos}`}
                  style={
                    reduce
                      ? undefined
                      : ({
                          animation: `floaty ${6 + i * 0.5}s ease-in-out infinite`,
                          animationDelay: `${p.delay}s`,
                          transform: `rotate(${p.rotate ?? 0}deg)`,
                        } as React.CSSProperties)
                  }
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 1024px) 30vw, 15vw"
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
