"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const cards = [
  {
    href: "/chocolates",
    eyebrow: "Available only in-store",
    title: "The Chocolate Boutique",
    body:
      "Hand-rolled Swiss truffles and a seasonal rotation of bonbons, made with premium Felchlin chocolate. Curated weekly at the counter — closer to jewelry than confection.",
    image: "/images/chocolates/hero-tray.jpg",
    cta: "Step inside the boutique",
    tone: "rust" as const,
  },
  {
    href: "/surprise-bag",
    eyebrow: "In partnership with Too Good To Go",
    title: "The Surprise Bag",
    body:
      "Save fresh pastries from waste. Reserve a mystery bag through the app at a fraction of the price.",
    image: "/images/heritage/bakery-storefront.jpg",
    cta: "Reserve a bag",
    tone: "forest" as const,
  },
];

export function Discover() {
  return (
    <section className="relative bg-cream-50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-rust" />
              Discover
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-sm text-cocoa/60 max-w-md">
              Two corners of the bakery worth your attention.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.06}>
              <Link
                href={c.href}
                className="group relative block aspect-[5/4] sm:aspect-[16/10] overflow-hidden rounded-[2rem] shadow-card"
              >
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.07]"
                />
                <div
                  className={`absolute inset-0 ${
                    c.tone === "rust"
                      ? "bg-gradient-to-tr from-rust/85 via-cocoa/40 to-transparent"
                      : "bg-gradient-to-tr from-forest/85 via-cocoa/40 to-transparent"
                  }`}
                />
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between text-cream-50">
                  <div className="text-[0.7rem] uppercase tracking-[0.3em] opacity-85">
                    {c.eyebrow}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] max-w-md">
                      {c.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm sm:text-base text-cream-50/85 leading-relaxed">
                      {c.body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em]">
                      {c.cta}
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cream-50/95 text-cocoa transition-transform group-hover:rotate-45">
                        <ArrowUpRight size={13} />
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
