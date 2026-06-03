"use client";

import Image from "next/image";
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

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll progress through the whole (tall) hero section.
  // 0 = top of hero at top of viewport · 1 = bottom of hero leaving viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ── WHOLE croissant (golden exterior) ──────────────────────────────
  // Visible at the top, then rotates + scales up and fades out.
  const wholeOpacity = useTransform(scrollYProgress, [0, 0.4, 0.52], [1, 1, 0]);
  const wholeRotateY = useTransform(scrollYProgress, [0, 0.55], [0, -18]);
  const wholeScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.12]);
  const wholeY = useTransform(scrollYProgress, [0, 0.55], [0, -24]);

  // ── CUT croissant (laminated interior) ─────────────────────────────
  // Hidden at the top, then rotates in + scales to full and stays.
  const cutOpacity = useTransform(scrollYProgress, [0.42, 0.56, 1], [0, 1, 1]);
  const cutRotateY = useTransform(scrollYProgress, [0.4, 1], [18, 0]);
  const cutScale = useTransform(scrollYProgress, [0.4, 1], [0.88, 1]);

  // ── Caption crossfade (tells the "open it up" story) ───────────────
  const capAOpacity = useTransform(scrollYProgress, [0, 0.34, 0.44], [1, 1, 0]);
  const capBOpacity = useTransform(scrollYProgress, [0.5, 0.62, 1], [0, 1, 1]);

  // Scroll hint fades out as soon as the user starts scrolling.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`relative isolate bg-cream-50 paper ${
        reduce ? "" : "min-h-[185vh]"
      }`}
    >
      {/* Pinned viewport: stays put while the tall section scrolls past it */}
      <div
        className={`${
          reduce ? "" : "sticky top-0"
        } flex min-h-screen items-center overflow-hidden`}
      >
        <AlpinePeaks className="hidden md:block absolute right-[-4rem] top-24 w-[520px] text-forest/15" />
        <AlpinePeaks className="md:hidden absolute right-[-3rem] top-28 w-[280px] text-forest/15" />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 pt-28 sm:pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* ── LEFT: copy ─────────────────────────────────────────── */}
            <div className="lg:col-span-7 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 text-forest"
              >
                <EdelweissMark size={28} />
                <span className="uppercase tracking-[0.32em] text-[0.7rem] sm:text-xs">
                  Hand-laminated · Baked daily · Biddeford, Maine
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 font-display text-[2.85rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem] text-cocoa"
              >
                Swiss-inspired bakery
                <span className="block italic text-forest">
                  in Biddeford, Maine.
                </span>
                <span className="block">Baked daily, by hand.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 max-w-xl text-lg leading-relaxed text-cocoa/75"
              >
                Hand-laminated croissants, slow-fermented Swiss breads,
                century-old pastries and small-batch chocolates. Made from
                scratch in our downtown Biddeford bakery — order online for
                in-store pick-up Tuesday through Sunday.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#shop"
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
                  <div className="font-display text-3xl text-forest">2007</div>
                  <div className="text-xs uppercase tracking-widest mt-1">
                    Trained in Switzerland
                  </div>
                </div>
                <div className="border-x border-cocoa/15 px-4">
                  <div className="font-display text-3xl text-forest">2024</div>
                  <div className="text-xs uppercase tracking-widest mt-1">
                    Opened in Biddeford
                  </div>
                </div>
                <div className="pl-4">
                  <div className="font-display text-3xl text-forest">Daily</div>
                  <div className="text-xs uppercase tracking-widest mt-1">
                    Baked from 2am
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: scroll-driven croissant ─────────────────────── */}
            <div className="lg:col-span-5 relative">
              <div
                className="relative aspect-[4/5] w-full"
                style={{ perspective: 1200 }}
              >
                {/* Whole croissant (golden exterior) */}
                <motion.div
                  style={
                    reduce
                      ? { opacity: 0 }
                      : {
                          opacity: wholeOpacity,
                          rotateY: wholeRotateY,
                          scale: wholeScale,
                          y: wholeY,
                        }
                  }
                  className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-card will-change-transform"
                >
                  <Image
                    src="/images/products/hero-croissant-whole.jpg"
                    alt="Hand-laminated butter croissant, golden and flaky, baked at Edelweiss in Biddeford, Maine"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/25 via-transparent to-transparent" />
                </motion.div>

                {/* Cut croissant (laminated interior) */}
                <motion.div
                  style={
                    reduce
                      ? { opacity: 1 }
                      : {
                          opacity: cutOpacity,
                          rotateY: cutRotateY,
                          scale: cutScale,
                        }
                  }
                  className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-card will-change-transform"
                >
                  <Image
                    src="/images/products/hero-croissant-cut.jpg"
                    alt="Cross-section of an Edelweiss croissant revealing an open, honeycomb crumb and dozens of buttery laminated layers"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/20 via-transparent to-transparent" />
                </motion.div>

                {/* Caption — crossfades with the image story */}
                <div className="absolute bottom-6 left-6 right-6 text-cream-50">
                  <motion.div
                    style={reduce ? { opacity: 0 } : { opacity: capAOpacity }}
                    className="absolute bottom-0 left-0 right-0"
                  >
                    <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-80">
                      Our signature
                    </div>
                    <div className="font-display text-2xl mt-1">
                      The butter croissant
                    </div>
                  </motion.div>
                  <motion.div
                    style={reduce ? { opacity: 1 } : { opacity: capBOpacity }}
                    className="absolute bottom-0 left-0 right-0"
                  >
                    <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-80">
                      Look inside
                    </div>
                    <div className="font-display text-2xl mt-1">
                      A feather-light, honeycomb crumb
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating pick-up badge */}
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute -left-6 -bottom-6 lg:-left-10 lg:-bottom-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-mustard/95 shadow-soft animate-floaty z-10"
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

          {/* Scroll hint */}
          {!reduce && (
            <motion.div
              style={{ opacity: hintOpacity }}
              className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cocoa/55"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.3em]">
                Scroll to open
              </span>
              <span className="block h-9 w-[1.5px] bg-cocoa/30 animate-pulse" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
