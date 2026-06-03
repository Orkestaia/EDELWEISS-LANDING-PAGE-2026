"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

/**
 * Floating cart button — bottom-right, site-wide. Shows item count and opens
 * the cart drawer. Hidden when empty so it never clutters the first view.
 */
export function CartButton() {
  const { count, open, hydrated, isOpen } = useCart();

  // No mostrar hasta hidratar (evita parpadeo) ni cuando el drawer está abierto.
  if (!hydrated || count === 0 || isOpen) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={open}
      aria-label={`Open cart (${count} items)`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-cocoa px-5 py-3.5 text-cream-50 shadow-card hover:bg-rust transition-colors"
    >
      <span className="relative">
        <ShoppingBag size={20} />
        <AnimatePresence>
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-mustard px-1 text-[0.7rem] font-semibold text-cocoa tabular-nums"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-xs uppercase tracking-[0.2em]">View order</span>
    </motion.button>
  );
}
