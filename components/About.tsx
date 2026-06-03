"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal } from "./Reveal";
import { AlpineSilhouette } from "./AlpineBackground";

/**
 * ABOUT — scroll-driven storytelling (editorial / cinematic).
 *
 * Each milestone in the timeline has a paired image in the LEFT column.
 * As you scroll through the timeline, the sticky image on the left fades from
 * one moment to the next (Switzerland → Lake Lucerne → kitchen → laminating
 * → storefront). This fills the previously-empty left column and ties the
 * text to a visual anchor.
 */

type Milestone = {
  year: string;
  where: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const milestones: Milestone[] = [
  {
    year: "2007",
    where: "Vitznau, Switzerland",
    title: "Two paths converge",
    body:
      "Alex Weissenfluh, an 18-year-old from Hartly, Delaware, moves across the Atlantic to reconnect with his father's Swiss roots. Valentina, a 19-year-old from Managua, Nicaragua, arrives with a background steeped in hospitality, arts and marketing from her family's businesses.",
    image: "/images/heritage/lucerne-weggis.jpg",
    alt: "The village of Weggis on the shore of Lake Lucerne, with the Swiss Alps rising in the background",
  },
  {
    year: "2007 – 2008",
    where: "Lake Lucerne",
    title: "12 months of fundamentals",
    body:
      "Twelve intense months mastering the fundamentals of European cuisine — from the delicate tempering of chocolate and the science of regional breads to the artistry of fine dining.",
    image: "/images/heritage/lucerne-kapellbrucke.jpg",
    alt: "Lucerne old town with the Kapellbrücke wooden bridge and the Jesuit church reflected in the Reuss river",
  },
  {
    year: "Nov 2020",
    where: "Biddeford, Maine",
    title: "A licensed home kitchen",
    body:
      "Settled in Biddeford, Alex and Valentina begin a small-scale chocolate production from a licensed home kitchen. Farmers' markets and collaborations with local businesses in Biddeford and Kennebunk give the community its first taste.",
    image: "/images/heritage/alex-bonbons-tempering.jpg",
    alt: "Hands in nitrile gloves tempering green pistachio chocolate into bonbon moulds",
  },
  {
    year: "2020 – 2023",
    where: "Heart of Biddeford",
    title: "Four years of preparation",
    body:
      "Mentorship through SCORE, rigorous planning, food cost analysis and business modeling. Community building with the Heart of Biddeford. The transition from home kitchen to storefront is a labor of love and strategy.",
    image: "/images/heritage/croissants-shaping.jpg",
    alt: "A baker shaping raw butter croissants on a wooden bench at the Edelweiss kitchen",
  },
  {
    year: "Jan 2024",
    where: "Main Street",
    title: "The doors open",
    body:
      "Edelweiss Pastry Shop officially opens its doors. A dedicated team of three bakers embrace the baker's life — including those quiet 2 AM shifts where the magic happens.",
    image: "/images/heritage/valentina-laminating.jpg",
    alt: "Valentina dusting flour on a sheet of laminated dough, wearing an Edelweiss apron and red edelweiss bandana",
  },
];

export function About() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Progress across the whole About section (not just the timeline).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="heritage"
      ref={sectionRef}
      className="relative isolate bg-forest-50 paper overflow-hidden"
    >
      <AlpineSilhouette
        tone="forest"
        className="absolute inset-x-0 top-0 w-full h-64 opacity-60 -translate-y-1/3"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* ───── LEFT: scroll-driven image carousel ───── */}
          <div className="lg:col-span-5 relative">
            <div
              className={`${
                reduce ? "" : "lg:sticky lg:top-24"
              } space-y-4`}
            >
              <ScrollImageStack
                milestones={milestones}
                scrollYProgress={scrollYProgress}
                reduce={!!reduce}
              />
            </div>

            {/* Mobile fallback: simple stack of polaroids (no scroll-link
                on mobile because the left column collapses below the text) */}
            <div className="mt-10 grid grid-cols-2 gap-4 lg:hidden">
              {milestones.slice(2, 5).map((m) => (
                <Reveal key={m.year} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card">
                  <Image
                    src={m.image}
                    alt={m.alt}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </div>
          </div>

          {/* ───── RIGHT: copy + timeline ───── */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-forest uppercase tracking-[0.32em] text-xs">
                <span className="w-8 h-px bg-forest" />
                About us
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cocoa leading-[1.05]">
                From Swiss roots
                <span className="block italic text-forest">
                  to Biddeford&apos;s heart.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-lg leading-relaxed text-cocoa/80 max-w-2xl">
                The story of Edelweiss is a{" "}
                <strong className="text-cocoa">19-year journey</strong> across
                continents — fueled by a shared passion for the culinary arts
                and a deep respect for heritage.
              </p>
            </Reveal>

            <ol className="mt-14 space-y-12">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.05} as="li">
                  <article className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8">
                    <div className="relative flex flex-col items-center">
                      <span className="font-display text-2xl text-rust leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-3 w-px flex-1 bg-cocoa/15" />
                    </div>
                    <div className="pb-2">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-display text-2xl text-forest">
                          {m.year}
                        </span>
                        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-cocoa/55">
                          {m.where}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl sm:text-3xl text-cocoa">
                        {m.title}
                      </h3>
                      <p className="mt-3 text-cocoa/75 leading-relaxed max-w-2xl">
                        {m.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.1}>
              <blockquote className="mt-16 border-l-2 border-rust pl-6 max-w-2xl">
                <p className="font-display italic text-2xl sm:text-3xl text-cocoa leading-snug">
                  &ldquo;We aren&apos;t just baking bread and tempering
                  chocolate; we are sharing a piece of our history and the
                  culture that shaped us.&rdquo;
                </p>
                <footer className="mt-4 text-xs uppercase tracking-[0.28em] text-cocoa/60">
                  — Alex &amp; Valentina, founders
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-10 text-cocoa/75 leading-relaxed max-w-2xl">
                Today, Alex, Valentina and a dedicated team of three bakers
                couldn&apos;t be more proud to be a thread in the fabric of
                this thriving community. Seeing the people of Biddeford show up
                for them every single day the doors are open is the greatest
                reward for their 19-year journey.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Sticky stack: all milestone images are positioned in the same frame, only
 * the one matching the current scroll progress is fully opaque. Visible only
 * on lg+ (on mobile the left column collapses and we render polaroids
 * separately).
 */
function ScrollImageStack({
  milestones,
  scrollYProgress,
  reduce,
}: {
  milestones: Milestone[];
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <div className="hidden lg:block">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-card bg-cocoa/10">
        {milestones.map((m, i) => (
          <ImageLayer
            key={m.year}
            milestone={m}
            index={i}
            total={milestones.length}
            scrollYProgress={scrollYProgress}
            reduce={reduce}
          />
        ))}

        {/* Caption + step indicator (also tied to scroll) */}
        <CaptionLayer
          milestones={milestones}
          scrollYProgress={scrollYProgress}
          reduce={reduce}
        />
      </div>
    </div>
  );
}

function ImageLayer({
  milestone,
  index,
  total,
  scrollYProgress,
  reduce,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  // Each slide owns a slice of the scroll progress; cross-fade with neighbours.
  const slice = 1 / total;
  const center = slice * (index + 0.5);
  const start = Math.max(center - slice * 0.9, 0);
  const peak1 = Math.max(center - slice * 0.2, 0);
  const peak2 = Math.min(center + slice * 0.2, 1);
  const end = Math.min(center + slice * 0.9, 1);

  const opacity = useTransform(
    scrollYProgress,
    [start, peak1, peak2, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [start, peak1, peak2, end],
    [1.04, 1, 1, 1.04]
  );

  return (
    <motion.div
      style={
        reduce
          ? { opacity: index === 0 ? 1 : 0 }
          : { opacity, scale }
      }
      className="absolute inset-0"
    >
      <Image
        src={milestone.image}
        alt={milestone.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover"
        priority={index === 0}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa/65 via-cocoa/0 to-transparent" />
    </motion.div>
  );
}

function CaptionLayer({
  milestones,
  scrollYProgress,
  reduce,
}: {
  milestones: Milestone[];
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 text-cream-50 pointer-events-none">
      {milestones.map((m, i) => (
        <Caption
          key={m.year}
          milestone={m}
          index={i}
          total={milestones.length}
          scrollYProgress={scrollYProgress}
          reduce={reduce}
        />
      ))}
    </div>
  );
}

function Caption({
  milestone,
  index,
  total,
  scrollYProgress,
  reduce,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const slice = 1 / total;
  const center = slice * (index + 0.5);
  const start = Math.max(center - slice * 0.5, 0);
  const peak1 = Math.max(center - slice * 0.15, 0);
  const peak2 = Math.min(center + slice * 0.15, 1);
  const end = Math.min(center + slice * 0.5, 1);
  const opacity = useTransform(
    scrollYProgress,
    [start, peak1, peak2, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={reduce ? { opacity: index === 0 ? 1 : 0 } : { opacity }}
      className="absolute inset-x-0 bottom-0"
      aria-hidden={index !== 0}
    >
      <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-85">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        <span className="mx-2">·</span>
        {milestone.where}
      </div>
      <div className="mt-1.5 font-display text-2xl leading-tight">
        {milestone.title}
      </div>
    </motion.div>
  );
}
