"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, Phone, Leaf } from "lucide-react";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";
import { FallingLeaves } from "./FallingLeaves";
import { useInventory } from "@/lib/inventory";
import { maineToday } from "@/lib/closures";
import { hoursForDate, hoursLabel, longDateLabel } from "@/lib/hours";
import { THANKSGIVING, THANKSGIVING_GROUPS, thanksgivingOpen, thanksgivingProducts } from "@/lib/thanksgiving";

/**
 * Thanksgiving pre-order block, shown at the top of the home page only
 * between THANKSGIVING.orderFrom and lastOrderDate (Maine dates). Add
 * ?preview=thanksgiving to the URL to see it outside the window.
 */
export function ThanksgivingSection() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { stocks } = useInventory();

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "thanksgiving";
    setVisible(preview || thanksgivingOpen(maineToday()));
  }, []);

  if (!visible) return null;

  const pickupHours = hoursLabel(hoursForDate(THANKSGIVING.pickupDate));
  const reopenHours = hoursLabel(hoursForDate(THANKSGIVING.reopenDate));

  return (
    <section
      id="thanksgiving"
      className="relative isolate overflow-hidden bg-[#F3E4D2] scroll-mt-24"
      aria-labelledby="tg-title"
    >
      {/* Autumn wash + leaves */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mustard/20 via-transparent to-rust/10" />
      <LeafScatter />
      <FallingLeaves density={1} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
                <span className="w-8 h-px bg-rust" />
                Pre-order · Thanksgiving 2026
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="tg-title"
                className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cocoa leading-[1.05]"
              >
                Thanksgiving
                <span className="italic text-rust"> pre-orders.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cocoa/75">
                Large tarts and kuchen for the table, soft rolls and focaccia for the
                feast, croissants for the morning after. Order now, pick everything up
                fresh on Wednesday.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="rounded-[1.8rem] bg-cream-50/90 backdrop-blur border border-cocoa/10 shadow-soft p-6 sm:p-7 space-y-4 text-sm text-cocoa">
              <InfoRow icon={<CalendarDays size={16} />} label="Order by">
                {longDateLabel(THANKSGIVING.lastOrderDate)}
              </InfoRow>
              <InfoRow icon={<Clock size={16} />} label="Pick-up">
                {longDateLabel(THANKSGIVING.pickupDate)} · {pickupHours}
              </InfoRow>
              <InfoRow icon={<Leaf size={16} />} label="Holiday hours">
                Closed Thanksgiving Day ·{" "}
                <span className="whitespace-nowrap">
                  {longDateLabel(THANKSGIVING.reopenDate)}: {reopenHours}
                </span>
              </InfoRow>
              <InfoRow icon={<Phone size={16} />} label="Also by phone">
                <a href="tel:+12077706945" className="hover:text-rust transition-colors">
                  {THANKSGIVING.phone}
                </a>{" "}
                or in person
              </InfoRow>
              <p className="pt-2 border-t border-cocoa/10 text-xs leading-relaxed text-cocoa/60">
                Loyalty points can only be redeemed in person at the counter, not online or by phone.
              </p>
            </div>
          </Reveal>
        </div>

        {THANKSGIVING_GROUPS.map((group, gi) => {
          const items = group.slugs
            .map((slug) => thanksgivingProducts.find((p) => p.slug === slug))
            .filter((p): p is NonNullable<typeof p> => !!p);
          if (!items.length) return null;
          return (
            <div key={group.title} className={gi === 0 ? "mt-16 sm:mt-20" : "mt-16"}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-5 border-b border-cocoa/15">
                <Reveal>
                  <h3 className="font-display text-3xl sm:text-4xl text-cocoa">{group.title}</h3>
                </Reveal>
                <Reveal delay={0.05} className="max-w-md">
                  <p className="text-sm text-cocoa/65 leading-relaxed">{group.blurb}</p>
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
                    categoryLabel="Thanksgiving pre-order"
                    soldOutLabel="Sold out"
                  />
                ))}
              </ul>
            </div>
          );
        })}

        <Reveal delay={0.1}>
          <p className="mt-12 text-center text-sm text-cocoa/60">
            Everything in this block is picked up on {longDateLabel(THANKSGIVING.pickupDate)}. Our everyday
            counter continues below.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rust/10 text-rust">
        {icon}
      </span>
      <div>
        <div className="text-[0.62rem] uppercase tracking-[0.24em] text-cocoa/55">{label}</div>
        <div className="mt-0.5 font-medium leading-snug">{children}</div>
      </div>
    </div>
  );
}

/** A few soft maple leaves, pure SVG, no assets to load. */
function LeafScatter() {
  const leaves = [
    { x: "4%", y: "12%", r: -20, s: 1.1, c: "#B85C3E" },
    { x: "92%", y: "8%", r: 25, s: 0.9, c: "#E2B341" },
    { x: "88%", y: "70%", r: -35, s: 1.3, c: "#B85C3E" },
    { x: "8%", y: "78%", r: 40, s: 0.8, c: "#8E7C68" },
    { x: "55%", y: "4%", r: 10, s: 0.7, c: "#E2B341" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden="true">
      {leaves.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 64 64"
          width={64 * l.s}
          height={64 * l.s}
          className="absolute"
          style={{ left: l.x, top: l.y, transform: `rotate(${l.r}deg)` }}
          fill={l.c}
        >
          <path d="M32 4c2 8 6 12 12 14-4 2-6 4-6 8 6-1 10 1 14 6-5 1-8 3-9 7 4 2 7 5 8 10-5-2-9-2-13 0 1 5 0 9-2 13-2-4-3-8-2-13-4 2-8 2-13 0 1-5 4-8 8-10-1-4-4-6-9-7 4-5 8-7 14-6 0-4-2-6-6-8 6-2 10-6 12-14z" />
        </svg>
      ))}
    </div>
  );
}
