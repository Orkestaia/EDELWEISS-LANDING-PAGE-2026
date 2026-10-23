"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Check, Leaf } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart, parsePrice } from "@/lib/cart";
import { stockState } from "@/lib/inventory";

/**
 * One product tile with photo, stock badge and "Add" button. Used by the
 * everyday Showcase and by dated pre-order blocks (Thanksgiving, Christmas).
 */
export function ProductCard({
  product: p,
  index,
  reduce,
  stock,
  categoryLabel,
  soldOutLabel = "Sold out today",
}: {
  product: Product;
  index: number;
  reduce: boolean;
  stock: number | null | undefined;
  /** Small caption above the name; defaults to the product category. */
  categoryLabel?: string;
  soldOutLabel?: string;
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
          {p.image ? (
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-contain p-5 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${
                soldOut ? "grayscale" : ""
              }`}
            />
          ) : (
            // No photo yet: a quiet placeholder instead of a broken image.
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cocoa/35">
              <Leaf size={30} strokeWidth={1.25} />
              <span className="text-[0.6rem] uppercase tracking-[0.3em]">Photo coming soon</span>
            </div>
          )}
          {p.tag && !soldOut && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-mustard/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cocoa">
              {p.tag}
            </span>
          )}
          {soldOut && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-cocoa/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cream-50">
              {soldOutLabel}
            </span>
          )}
          {isLow && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-rust/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-cream-50">
              Only {stock} left
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="text-[0.65rem] uppercase tracking-[0.22em] text-rust">
            {categoryLabel ?? p.category}
          </div>
          <h4 className="mt-1.5 font-display text-xl sm:text-2xl text-cocoa leading-tight">
            {p.name}
          </h4>
          <p className="mt-2 text-sm text-cocoa/70 leading-relaxed">{p.description}</p>

          <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-cocoa/10">
            {priceValue != null ? (
              <span className="font-display text-2xl sm:text-[1.7rem] text-cocoa tabular-nums">
                {p.price}
              </span>
            ) : (
              <span className="text-xs uppercase tracking-[0.18em] text-cocoa/50">In-store only</span>
            )}

            {priceValue != null && (
              <button
                onClick={handleAdd}
                disabled={soldOut}
                aria-label={soldOut ? `${p.name} sold out` : `Add ${p.name} to cart`}
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
