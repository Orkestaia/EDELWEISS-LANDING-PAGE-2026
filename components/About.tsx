"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { AlpineSilhouette } from "./AlpineBackground";

const milestones = [
  {
    year: "2007",
    where: "Vitznau, Switzerland",
    title: "Two paths converge",
    body:
      "Alex Weissenfluh, an 18-year-old from Hartly, Delaware, moves across the Atlantic to reconnect with his father's Swiss roots. Valentina, a 19-year-old from Managua, Nicaragua, arrives with a background steeped in hospitality, arts and marketing from her family's businesses.",
  },
  {
    year: "2007 – 2008",
    where: "Lake Lucerne",
    title: "12 months of fundamentals",
    body:
      "Twelve intense months mastering the fundamentals of European cuisine — from the delicate tempering of chocolate and the science of regional breads to the artistry of fine dining.",
  },
  {
    year: "Nov 2020",
    where: "Biddeford, Maine",
    title: "A licensed home kitchen",
    body:
      "Settled in Biddeford, Alex and Valentina begin a small-scale chocolate production from a licensed home kitchen. Farmers' markets and collaborations with local businesses in Biddeford and Kennebunk give the community its first taste.",
  },
  {
    year: "2020 – 2023",
    where: "Heart of Biddeford",
    title: "Four years of preparation",
    body:
      "Mentorship through SCORE, rigorous planning, food cost analysis and business modeling. Community building with the Heart of Biddeford. The transition from home kitchen to storefront is a labor of love and strategy.",
  },
  {
    year: "Jan 2024",
    where: "Main Street",
    title: "The doors open",
    body:
      "Edelweiss Pastry Shop officially opens its doors. A dedicated team of three bakers embrace the baker's life — including those quiet 2 AM shifts where the magic happens.",
  },
];

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

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <Reveal className="lg:col-span-5 relative lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-card">
              <Image
                src="/images/heritage/bakery-kitchen.jpg"
                alt="Inside the Edelweiss bakery kitchen in Biddeford, Maine"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-cocoa/0 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-cream-50">
                <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-85">
                  2 AM, every day
                </div>
                <div className="font-display text-2xl mt-1">
                  Where the quiet magic happens.
                </div>
              </div>
            </div>
            <div className="hidden sm:block absolute -right-6 -bottom-6 lg:-right-10 lg:-bottom-10 aspect-square w-44 rounded-[1.4rem] overflow-hidden shadow-card border-4 border-cream-50">
              <Image
                src="/images/heritage/bakery-storefront.jpg"
                alt="Edelweiss storefront on Main Street, Biddeford"
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
