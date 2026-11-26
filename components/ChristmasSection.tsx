"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, Phone, Snowflake } from "lucide-react";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";
import { FirSprig, SnowCap, SnowDrift, StringLights } from "./ChristmasDecor";
import { SNOWFLAKE_PATH } from "./FallingSnow";
import { useInventory } from "@/lib/inventory";
import { maineToday } from "@/lib/closures";
import { hoursForDate, hoursLabel, longDateLabel } from "@/lib/hours";
import { CHRISTMAS, CHRISTMAS_GROUPS, christmasOpen, christmasProducts } from "@/lib/christmas";

/** "2026-12-24" → "December 24" */
function monthDay(date: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", day: "numeric" }).format(
    new Date(`${date}T12:00:00Z`)
  );
}

/**
 * Christmas pre-order block, shown at the top of the home page only between
 * CHRISTMAS.orderFrom and lastOrderDate (Maine dates). Add ?preview=christmas
 * to the URL to see it outside the window.
 */
export function ChristmasSection() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { stocks } = useInventory();

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "christmas";
    setVisible(preview || christmasOpen(maineToday()));
  }, []);

  if (!visible) return null;

  const pickupHours = hoursLabel(hoursForDate(CHRISTMAS.pickupDate));
  const reopenHours = hoursLabel(hoursForDate(CHRISTMAS.reopenDate));
  const newYearHours = hoursLabel(hoursForDate(CHRISTMAS.newYearDate));
  const closedUntilDay = CHRISTMAS.closedUntil.slice(8).replace(/^0/, "");

  return (
    <section
      id="christmas"
      className="relative isolate overflow-hidden bg-[#1F3B2E] text-cream-50 scroll-mt-24"
      aria-labelledby="xmas-title"
    >
      {/* Candle-light wash, fir sprigs, a few still snowflakes, lights on top */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(226,179,65,0.16),transparent_55%),radial-gradient(ellipse_at_90%_100%,rgba(184,92,62,0.14),transparent_50%)]" />
      <FirSprig className="absolute -left-6 top-10 hidden opacity-80 sm:block -scale-y-100" size={260} />
      <FirSprig className="absolute -right-6 top-10 hidden opacity-80 sm:block -scale-100" size={260} />
      <SnowflakeScatter />
      <StringLights />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-28 sm:pt-36 sm:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
                <span className="w-8 h-px bg-mustard" />
                Christmas 2026
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="xmas-title"
                className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cream-50 leading-[1.05]"
              >
                Christmas
                <span className="italic text-mustard"> menu.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-50/80">
                Stollen and panettone, large desserts for the table, soft rolls and focaccia
                for dinner, croissants for Christmas morning. Order by{" "}
                {monthDay(CHRISTMAS.lastOrderDate)} and pick everything up fresh on{" "}
                {longDateLabel(CHRISTMAS.pickupDate)}.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="relative rounded-[1.8rem] bg-cream-50 border border-cream-50/20 shadow-card p-6 pt-8 sm:p-7 sm:pt-9 space-y-4 text-sm text-cocoa">
              <SnowCap />
              <InfoRow icon={<CalendarDays size={16} />} label="Order by">
                {longDateLabel(CHRISTMAS.lastOrderDate)}
              </InfoRow>
              <InfoRow icon={<Clock size={16} />} label="Pick-up">
                {longDateLabel(CHRISTMAS.pickupDate)} · {pickupHours}
              </InfoRow>
              <InfoRow icon={<Snowflake size={16} />} label="Holiday hours">
                Closed {monthDay(CHRISTMAS.closedFrom)} to {closedUntilDay}
                <span className="block font-normal text-cocoa/75">
                  {longDateLabel(CHRISTMAS.reopenDate)}: {reopenHours}
                </span>
                <span className="block font-normal text-cocoa/75">
                  {longDateLabel(CHRISTMAS.newYearDate)}: {newYearHours}
                </span>
              </InfoRow>
              <InfoRow icon={<Phone size={16} />} label="Also by phone">
                <a href="tel:+12077706945" className="hover:text-rust transition-colors">
                  {CHRISTMAS.phone}
                </a>{" "}
                or in person
              </InfoRow>
            </div>
          </Reveal>
        </div>

        {CHRISTMAS_GROUPS.map((group, gi) => {
          const items = group.slugs
            .map((slug) => christmasProducts.find((p) => p.slug === slug))
            .filter((p): p is NonNullable<typeof p> => !!p);
          if (!items.length) return null;
          return (
            <div key={group.title} className={gi === 0 ? "mt-16 sm:mt-20" : "mt-16"}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-5 border-b border-cream-50/20">
                <Reveal>
                  <h3 className="font-display text-3xl sm:text-4xl text-cream-50">{group.title}</h3>
                </Reveal>
                <Reveal delay={0.05} className="max-w-md">
                  <p className="text-sm text-cream-50/70 leading-relaxed">{group.blurb}</p>
                </Reveal>
              </div>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {items.map((p, i) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    index={i}
                    reduce={!!reduce}
                    stock={stocks[p.slug]}
                    categoryLabel="Christmas menu"
                    soldOutLabel="Sold out"
                  />
                ))}
              </ul>
            </div>
          );
        })}

        <Reveal delay={0.1}>
          <p className="mt-12 text-center text-sm text-cream-50/70">
            Everything in this block is picked up on {longDateLabel(CHRISTMAS.pickupDate)}. Our everyday
            counter continues below.
          </p>
        </Reveal>
      </div>

      <SnowDrift />
    </section>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
        {icon}
      </span>
      <div>
        <div className="text-[0.62rem] uppercase tracking-[0.24em] text-cocoa/55">{label}</div>
        <div className="mt-0.5 font-medium leading-snug">{children}</div>
      </div>
    </div>
  );
}

/** A few large, still snow crystals in the background. */
function SnowflakeScatter() {
  const flakes = [
    { x: "12%", y: "30%", s: 90, r: 10 },
    { x: "78%", y: "22%", s: 70, r: 25 },
    { x: "46%", y: "9%", s: 48, r: 0 },
    { x: "88%", y: "62%", s: 110, r: 15 },
    { x: "5%", y: "74%", s: 64, r: 30 },
    { x: "60%", y: "88%", s: 56, r: 5 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.09]" aria-hidden="true">
      {flakes.map((f, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={f.s}
          height={f.s}
          className="absolute"
          style={{ left: f.x, top: f.y, transform: `rotate(${f.r}deg)` }}
        >
          <path d={SNOWFLAKE_PATH} fill="none" stroke="#FBF7EC" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}
