"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  products,
  categories,
  categoryDescriptions,
  type ProductCategory,
} from "@/lib/products";
import { Reveal } from "./Reveal";

export function Showcase() {
  return (
    <section id="shop" className="relative bg-cream-50 paper">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <ShowcaseHeader />
        <CategoryNav />

        <div className="mt-20 space-y-28 sm:space-y-32">
          {categories.map((cat) => (
            <CategorySection key={cat} category={cat} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-24 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 text-cocoa px-7 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-cocoa hover:text-cream-50 transition-colors"
            >
              See the full menu with prices
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ShowcaseHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
      <div>
        <Reveal>
          <span className="inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
            <span className="w-8 h-px bg-rust" />
            The Window
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cocoa leading-[1.05] max-w-2xl">
            Today on the
            <span className="italic text-forest"> counter.</span>
          </h2>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="max-w-md text-cocoa/75">
        <p className="text-lg leading-relaxed">
          The full catalog of what we bake — organized the way our shelves are.
          Tap any pastry to reserve yours for pick-up.
        </p>
      </Reveal>
    </div>
  );
}

function CategoryNav() {
  return (
    <Reveal delay={0.12}>
      <nav className="mt-12 flex flex-wrap gap-2 sm:gap-3">
        {categories.map((c) => (
          <a
            key={c}
            href={`#cat-${c.toLowerCase()}`}
            className="px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase border border-cocoa/15 text-cocoa/70 hover:border-cocoa/60 hover:text-cocoa transition-colors"
          >
            {c}
          </a>
        ))}
        <Link
          href="/chocolates"
          className="px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase border border-rust/30 text-rust hover:bg-rust hover:text-cream-50 transition-colors"
        >
          Chocolates →
        </Link>
      </nav>
    </Reveal>
  );
}

function CategorySection({ category }: { category: ProductCategory }) {
  const reduce = useReducedMotion();
  const items = products.filter((p) => p.category === category);

  return (
    <div
      id={`cat-${category.toLowerCase()}`}
      className="scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-cocoa/15">
        <Reveal>
          <h3 className="font-display text-3xl sm:text-4xl text-cocoa">
            {category}
          </h3>
        </Reveal>
        <Reveal delay={0.05} className="max-w-md">
          <p className="text-sm text-cocoa/65 leading-relaxed">
            {categoryDescriptions[category]}
          </p>
        </Reveal>
      </div>

      <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {items.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: (i % 6) * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative"
          >
            <a
              href="#order"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-cream-100 shadow-soft">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-cocoa/0 to-cocoa/0 opacity-90 group-hover:from-cocoa/70 transition-colors" />
                {p.tag && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-mustard/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cocoa">
                    {p.tag}
                  </span>
                )}
                {p.price && (
                  <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-cream-50/95 px-3 py-1 text-xs font-display text-cocoa">
                    {p.price}
                  </span>
                )}
                <span className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/95 text-cocoa transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
                <div className="absolute inset-x-5 bottom-5 right-16 text-cream-50">
                  <h4 className="font-display text-xl sm:text-2xl leading-tight">
                    {p.name}
                  </h4>
                  <p className="mt-1.5 text-sm text-cream-50/85 line-clamp-2 hidden sm:block">
                    {p.description}
                  </p>
                </div>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
