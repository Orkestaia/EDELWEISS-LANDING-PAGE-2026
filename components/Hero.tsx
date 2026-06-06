"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EdelweissMark } from "./EdelweissMark";
import { AlpinePeaks } from "./AlpineBackground";

/**
 * HERO — two-track design:
 *   MOBILE  : the cut croissant sits BEHIND the headline at low opacity (a
 *             translucent backdrop), so copy stays primary and readable.
 *             Scroll cross-fades the whole croissant into the cut one.
 *   DESKTOP : copy on the left, a centre croissant on the right with five
 *             signature products floating around it. Photos use the classic
 *             multiply blend trick so their white studio backgrounds disappear
 *             into the cream paper — no boxy white edges. Amplified floaty.
 */

interface FloatingItem {
  src: string;
  alt: string;
  pos: string;
  delay: number;
  duration: number;
  rotate?: number;
}

const floatingProducts: FloatingItem[] = [
  {
    src: "/images/products/nuss-schnecken.jpg",
    alt: "Nuss Schnecken — Swiss nut spiral",
    pos: "top-[1%] left-[-6%] w-[22%] sm:w-[19%] lg:w-[21%]",
    delay: 0,
    duration: 7.2,
    rotate: -6,
  },
  {
    src: "/images/chocolates/truffle-trio.jpg",
    alt: "Swiss chocolate truffles",
    pos: "top-[0%] right-[-5%] w-[28%] sm:w-[23%] lg:w-[23%]",
    delay: 1.2,
    duration: 8.4,
    rotate: 5,
  },
  {
    src: "/images/products/almond-croissant.jpg",
    alt: "Almond croissant",
    pos: "top-[44%] left-[-9%] w-[26%] sm:w-[21%] lg:w-[20%]",
    delay: 2.0,
    duration: 9.0,
    rotate: -4,
  },
  {
    src: "/images/products/berliner.jpg",
    alt: "Berliner — raspberry-filled doughnut",
    pos: "bottom-[5%] right-[-4%] w-[24%] sm:w-[19%] lg:w-[19%]",
    delay: 0.6,
    duration: 7.6,
    rotate: 7,
  },
  {
    src: "/images/products/spitzbub.jpg",
    alt: "Spitzbub — Swiss raspberry shortbread",
    pos: "hidden sm:block bottom-[11%] left-[3%] w-[14%] sm:w-[13%] lg:w-[14%]",
    delay: 1.8,
    duration: 6.8,
    rotate: 10,
  },
];

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll progress drives the whole→cut crossfade on the mobile backdrop.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const wholeOpacity = useTransform(scrollYProgress, [0, 0.45, 0.55], [0.22, 0.06, 0]);
  const cutOpacity = useTransform(scrollYProgress, [0, 0.45, 0.55], [0, 0.18, 0.22]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-cream-50 paper"
    >
      {/* Decorative Alpine peaks (subtle, behind everything) */}
      <AlpinePeaks className="hidden md:block absolute right-[-4rem] top-24 w-[520px] text-forest/10 pointer-events-none" />

      {/* ─── MOBILE backdrop: croissant whole→cut translucent behind the copy ─── */}
      <div className="lg:hidden absolute inset-0 pointer-events-none">
        <motion.div
          style={reduce ? { opacity: 0.18 } : { opacity: wholeOpacity }}
          className="absolute inset-0"
        >
          <Image
            src="/images/products/hero-croissant-whole.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center mix-blend-multiply"
          />
        </motion.div>
        <motion.div
          style={reduce ? { opacity: 0.16 } : { opacity: cutOpacity }}
          className="absolute inset-0"
        >
          <Image
            src="/images/products/hero-croissant-cut.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-contain object-center mix-blend-multiply"
          />
        </motion.div>
        {/* Soft cream wash to keep text legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50/40 via-cream-50/10 to-cream-50/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 sm:pt-36 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ───── COPY ───── */}
          <div className="lg:col-span-6 relative z-10 text-center lg:text-left">
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
              className="mt-6 font-display text-[2.7rem] leading-[1.04] sm:text-6xl lg:text-[5rem] text-cocoa"
            >
              Swiss-inspired
              <span className="block italic text-forest">bakery in Biddeford.</span>
              <span className="block">Baked daily, by hand.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto lg:mx-0 mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-cocoa/80"
            >
              Hand-laminated croissants, century-old pastries and
              small-batch chocolates — made from scratch on Alfred Street,
              in downtown Biddeford.
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

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="mt-12 grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 text-cocoa/75"
            >
              <div>
                <dt className="text-[0.6rem] uppercase tracking-[0.25em]">
                  Trained in
                </dt>
                <dd className="font-display text-2xl sm:text-3xl text-forest mt-1">
                  Switzerland
                </dd>
              </div>
              <div className="border-x border-cocoa/15 px-3">
                <dt className="text-[0.6rem] uppercase tracking-[0.25em]">
                  Pick-up
                </dt>
                <dd className="font-display text-2xl sm:text-3xl text-forest mt-1">
                  Tue – Sun
                </dd>
              </div>
              <div className="pl-3">
                <dt className="text-[0.6rem] uppercase tracking-[0.25em]">
                  Hours
                </dt>
                <dd className="font-display text-2xl sm:text-3xl text-forest mt-1">
                  7 – 2
                </dd>
              </div>
            </motion.dl>
          </div>

          {/* ───── DESKTOP ONLY: croissant centre + floating products ───── */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-[40rem]">
              {/* Warm halo behind the centrepiece */}
              <div
                aria-hidden
                className="absolute inset-[14%] rounded-full bg-mustard/25 blur-3xl"
              />

              {/* Centre piece: cut croissant. mix-blend-multiply kills the
                  white studio background against the cream paper. */}
              <motion.div
                initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[6%]"
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
                    sizes="40vw"
                    className="object-contain mix-blend-multiply"
                  />
                </div>
              </motion.div>

              {/* Floating products around the centre — wider float amplitude
                  and same multiply blend so they sit naturally on cream */}
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
                          animation: `floatyBig ${p.duration}s ease-in-out infinite`,
                          animationDelay: `${p.delay}s`,
                          // CSS variable picked up by the keyframes so rotate
                          // and translate can compose without overriding.
                          ["--r" as string]: `${p.rotate ?? 0}deg`,
                        } as React.CSSProperties)
                  }
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 1024px) 30vw, 15vw"
                      className="object-contain mix-blend-multiply"
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
