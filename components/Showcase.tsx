"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  products,
  categories,
  categoryDescriptions,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { useCart, parsePrice } from "@/lib/cart";
import { useInventory, stockState } from "@/lib/inventory";
import { Reveal } from "./Reveal";

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

function ProductCard({
  product: p,
  index,
  reduce,
  stock,
}: {
  product: Product;
  index: number;
  reduce: boolean;
  stock: number | null | undefined;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const priceValue = parsePrice(p.price);
  const state = stockState(stock);
  const soldOut = state === "sold-out";
  const isLow = state === "low" && typeof stock === "number";

  function handleAdd() {
    if (priceValue == null || soldOut) return;
    addItem({ slug: p.slug, name: p.name, price: priceValue, image: p.image });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: (index % 6) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <article
        className={`flex h-full flex-col rounded-[1.6rem] overflow-hidden bg-cream-100 shadow-soft hover:shadow-card transition-shadow border border-cocoa/5 ${
          soldOut ? "opacity-70" : ""
        }`}
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-cream-50">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-5 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${
              soldOut ? "grayscale" : ""
            }`}
          />
          {p.tag && !soldOut && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-mustard/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cocoa">
              {p.tag}
            </span>
          )}
          {soldOut && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-cocoa/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cream-50">
              Sold out today
            </span>
          )}
          {isLow && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-rust/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cream-50">
              Only {stock} left
            </span>
          )}
        </div>

        {/* Caption */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-rust">
            {p.category}
          </div>
          <h4 className="mt-1.5 font-display text-xl sm:text-2xl text-cocoa leading-tight">
            {p.name}
          </h4>
          <p className="mt-2 text-sm text-cocoa/70 leading-relaxed">
            {p.description}
          </p>

          {/* Price + Add to cart */}
          <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-cocoa/10">
            {priceValue != null ? (
              <span className="font-display text-2xl sm:text-[1.7rem] text-cocoa tabular-nums">
                {p.price}
              </span>
            ) : (
              <span className="text-xs uppercase tracking-[0.18em] text-cocoa/50">
                In-store only
              </span>
            )}

            {priceValue != null && (
              <button
                onClick={handleAdd}
                disabled={soldOut}
                aria-label={
                  soldOut
                    ? `${p.name} sold out today`
                    : `Add ${p.name} to cart`
                }
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed ${
                  soldOut
                    ? "bg-cocoa/20 text-cocoa/50"
                    : added
                    ? "bg-forest text-cream-50"
                    : "bg-cocoa text-cream-50 hover:bg-rust"
                }`}
              >
                {soldOut ? (
                  "Sold out"
                ) : added ? (
                  <>
                    <Check size={15} /> Added
                  </>
                ) : (
                  <>
                    <Plus size={15} /> Add
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </article>
    </motion.li>
  );
}
