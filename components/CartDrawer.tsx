"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart, formatPrice } from "@/lib/cart";

export function CartDrawer() {
  const { items, isOpen, close, total, count, setQuantity, removeItem } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-cocoa/40 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-card"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-5">
              <div className="flex items-center gap-2.5 text-cocoa">
                <ShoppingBag size={18} />
                <span className="font-display text-xl">
                  Your order{" "}
                  {count > 0 && (
                    <span className="text-cocoa/50 text-base">({count})</span>
                  )}
                </span>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full text-cocoa/70 hover:bg-cocoa/5 hover:text-cocoa transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-cocoa/5 text-cocoa/40">
                  <ShoppingBag size={26} />
                </div>
                <p className="text-cocoa/60">Your cart is empty.</p>
                <button
                  onClick={close}
                  className="rounded-full border border-cocoa/25 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-cocoa hover:bg-cocoa hover:text-cream-50 transition-colors"
                >
                  Browse the counter
                </button>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-lg leading-tight text-cocoa">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.slug)}
                          aria-label={`Remove ${item.name}`}
                          className="text-cocoa/40 hover:text-rust transition-colors"
                        >
                          <X size={15} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity stepper */}
                        <div className="flex items-center gap-3 rounded-full border border-cocoa/15 px-1 py-1">
                          <button
                            onClick={() => setQuantity(item.slug, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-6 w-6 place-items-center rounded-full text-cocoa hover:bg-cocoa/5"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="min-w-4 text-center text-sm tabular-nums text-cocoa">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.slug, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="grid h-6 w-6 place-items-center rounded-full text-cocoa hover:bg-cocoa/5"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="font-display text-lg text-cocoa tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Footer / checkout */}
            {items.length > 0 && (
              <div className="border-t border-cocoa/10 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-cocoa">
                  <span className="text-sm uppercase tracking-[0.2em] text-cocoa/60">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-cocoa/55">
                  Pick-up only · Tuesday–Sunday, 7am–2pm. You&apos;ll choose your
                  pick-up time at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full rounded-full bg-cocoa px-6 py-4 text-center text-sm uppercase tracking-[0.2em] text-cream-50 hover:bg-rust transition-colors"
                >
                  Continue to checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
