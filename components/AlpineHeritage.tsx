"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EdelweissMark } from "./EdelweissMark";

/**
 * ALPINE HERITAGE — a scroll-driven "step into the Alps" cinematic moment.
 *
 * Inspired by the scroll-expansion technique (media grows from a framed card
 * to full-bleed as you scroll into it), but implemented with scroll-LINKED
 * motion values instead of hijacking the page scroll — so it stays smooth,
 * accessible, and composes safely between sections.
 *
 * Effects, driven by how far the (tall) section has scrolled:
 *  - The Matterhorn starts as a rounded framed card on cream, then the frame
 *    opens up (clip-path) until it fills the whole viewport.
 *  - Continuous Ken Burns zoom for life.
 *  - Headline scales up and a parallax pulls you "into" the peak.
 *  - Warm cocoa→forest overlay harmonises the cool-blue photo with the brand.
 *
 * Image expected at: /images/heritage/matterhorn.jpg
 */
export function AlpineHeritage() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Progress as the tall section scrolls through the pinned viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Frame opens from a card (inset) to full-bleed (inset 0).
  const insetX = useTransform(scrollYProgress, [0, 0.55], [15, 0]);
  const insetY = useTransform(scrollYProgress, [0, 0.55], [12, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [30, 0]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;

  // Slow push-in (depth) + headline scale.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const titleScale = useTransform(scrollYProgress, [0, 0.55], [0.92, 1.06]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  // Scrim deepens as the image fills the screen (keeps text legible).
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.5], [0.28, 0.5]);

  // The founder line fades in once we're fully "inside" the Alps.
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.55, 0.72], [24, 0]);

  // Scroll hint disappears as soon as you start.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Swiss Alpine heritage"
      className={`relative isolate bg-cream-50 ${reduce ? "" : "min-h-[200vh]"}`}
    >
      <div
        className={`${
          reduce ? "" : "sticky top-0"
        } flex min-h-screen items-center justify-center overflow-hidden`}
      >
        {/* Expanding Matterhorn frame */}
        <motion.div
          style={reduce ? undefined : { clipPath }}
          className="absolute inset-0"
        >
          <motion.div
            style={reduce ? undefined : { scale: imageScale }}
            className={`relative h-full w-full ${reduce ? "" : "animate-kenburns"}`}
          >
            <Image
              src="/images/heritage/matterhorn.jpg"
              alt="The Matterhorn at dawn reflected in an alpine lake near Zermatt, Switzerland"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Brand-harmonizing overlays (cool blue -> warm Edelweiss palette) */}
          <div className="absolute inset-0 bg-gradient-to-br from-cocoa/65 via-cocoa/25 to-forest/65" />
          <div className="absolute inset-0 bg-rust/15 mix-blend-soft-light" />
          <motion.div
            style={reduce ? { opacity: 0.45 } : { opacity: scrimOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-cocoa via-transparent to-cocoa/30"
          />
        </motion.div>

        {/* Centered headline */}
        <motion.div
          style={reduce ? undefined : { y: titleY }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center text-cream-50"
        >
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3"
          >
            <EdelweissMark size={26} className="text-cream-50" />
            <span className="uppercase tracking-[0.34em] text-[0.7rem] sm:text-xs text-cream-50/85">
              Zermatt · Swiss Alps
            </span>
          </motion.div>

          <motion.h2
            style={reduce ? undefined : { scale: titleScale }}
            className="mt-7 font-display text-4xl sm:text-5xl lg:text-[4rem] leading-[1.04] origin-center"
          >
            Trained at the foot
            <span className="block italic text-mustard">of the Matterhorn.</span>
          </motion.h2>

          {/* Founder line — revealed once fully "inside" the mountains */}
          <motion.p
            style={
              reduce
                ? undefined
                : { opacity: captionOpacity, y: captionY }
            }
            className="mx-auto mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-cream-50/85"
          >
            In the shadow of Switzerland&apos;s most iconic peak, Alex spent
            three months learning the Alpine craft — the patient lamination, the
            slow-fermented breads, the quiet discipline of dawn. That same craft
            now rises fresh every morning on Main Street, Biddeford.
          </motion.p>
        </motion.div>

        {/* Scroll hint */}
        {!reduce && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-50/70"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.3em]">
              Scroll into the Alps
            </span>
            <span className="block h-9 w-[1.5px] bg-cream-50/40 animate-pulse" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
