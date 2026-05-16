"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { AlpineSilhouette } from "./AlpineBackground";

export function About() {
  return (
    <section
      id="heritage"
      className="relative isolate bg-forest-50 paper overflow-hidden"
    >
      <AlpineSilhouette
        tone="forest"
        className="absolute inset-x-0 top-0 w-full h-64 opacity-60 -translate-y-1/3"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <Reveal className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-card">
            <Image
              src="/images/heritage/bakery-kitchen.jpg"
              alt="Inside the Edelweiss bakery kitchen"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="hidden sm:block absolute -right-6 -bottom-6 lg:-right-10 lg:-bottom-10 aspect-square w-44 rounded-[1.4rem] overflow-hidden shadow-card border-4 border-cream-50">
            <Image
              src="/images/heritage/bakery-storefront.jpg"
              alt="Edelweiss storefront"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-forest uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-forest" />
              Heritage
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cocoa leading-[1.05]">
              Old-world technique.
              <span className="block italic text-forest">
                New England soul.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-lg leading-relaxed text-cocoa/80 max-w-2xl">
              Edelweiss began as a love letter to the Swiss countryside —
              braided Zopf on Sunday mornings, Läckerli wrapped in wax paper,
              and the unmistakable scent of butter laminating against cold
              marble. We carry those rituals to our bakery in Biddeford, where
              every morning starts the same way: doughs that have rested for
              days, hands trained by patience, and a small, devoted team.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-cocoa/80 max-w-2xl">
              No shortcuts. No fillers. Just the Swiss hospitality we grew up
              with, delivered with a Maine accent.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl">
              <div className="border-t border-cocoa/15 pt-4">
                <dt className="text-xs uppercase tracking-[0.22em] text-cocoa/60">
                  Founded
                </dt>
                <dd className="mt-1 font-display text-2xl text-forest">
                  Biddeford, ME
                </dd>
              </div>
              <div className="border-t border-cocoa/15 pt-4">
                <dt className="text-xs uppercase tracking-[0.22em] text-cocoa/60">
                  Daily bakes
                </dt>
                <dd className="mt-1 font-display text-2xl text-forest">
                  Pre-dawn
                </dd>
              </div>
              <div className="border-t border-cocoa/15 pt-4">
                <dt className="text-xs uppercase tracking-[0.22em] text-cocoa/60">
                  Source
                </dt>
                <dd className="mt-1 font-display text-2xl text-forest">
                  New England
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
