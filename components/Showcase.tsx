"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  products,
  categories,
  categoryDescriptions,
  type ProductCategory,
} from "@/lib/products";
import { useInventory } from "@/lib/inventory";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";

export function Showcase() {
  const { stocks } = useInventory();
  return (
    <section id="shop" className="relative bg-cream-50 paper">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <ShowcaseHeader />
        <CategoryNav />

        <div className="mt-20 space-y-28 sm:space-y-32">
          {categories.map((cat) => (
            <CategorySection key={cat} category={cat} stocks={stocks} />
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
          Add what you love to your order and pick it up fresh.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-cocoa/55">
          Stock updates in real time, but online only shows a portion of each
          morning's bake. If something reads as sold out, we likely still
          have more at the counter — come see us.
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

function CategorySection({
  category,
  stocks,
}: {
  category: ProductCategory;
  stocks: Record<string, number | null>;
}) {
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
          <ProductCard
            key={p.slug}
            product={p}
            index={i}
            reduce={!!reduce}
            stock={stocks[p.slug]}
          />
        ))}
      </ul>
    </div>
  );
}
