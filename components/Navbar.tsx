"use client";

import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { EdelweissMark } from "./EdelweissMark";
import { useCart } from "@/lib/cart";

const nav: { href: string; label: string }[] = [
  { href: "/#shop", label: "Shop" },
  { href: "/menu", label: "Menu" },
  { href: "/chocolates", label: "Chocolates" },
  { href: "/surprise-bag", label: "Surprise Bag" },
  { href: "/#visit", label: "Visit" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openCart, count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/92 backdrop-blur-md border-b border-cocoa/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-cocoa group">
            <EdelweissMark
              size={38}
              className="shrink-0 transition-transform duration-700 group-hover:rotate-[40deg]"
            />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl sm:text-[1.55rem] tracking-wide">
                Edelweiss
              </span>
              <span className="hidden sm:block mt-1 text-[0.6rem] uppercase tracking-[0.32em] text-cocoa/65">
                Pastry Shop
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[0.72rem] tracking-[0.22em] uppercase text-cocoa/80">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="hover:text-rust transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-5 py-2.5 text-xs tracking-[0.22em] uppercase hover:bg-rust transition-colors"
            >
              <ShoppingBag size={15} />
              Order online
              {count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-mustard px-1 text-[0.7rem] font-semibold text-cocoa tabular-nums">
                  {count}
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2 text-cocoa"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-cream-50 border-t border-cocoa/10">
          <div className="px-5 py-6 flex flex-col gap-5">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-cocoa text-sm tracking-[0.2em] uppercase"
              >
                {n.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCart();
              }}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cocoa text-cream-50 px-5 py-3 text-sm tracking-[0.2em] uppercase"
            >
              <ShoppingBag size={16} />
              Order online
            </button>
            <a
              href="tel:+12077706945"
              className="text-cocoa/70 text-xs tracking-[0.2em] uppercase"
            >
              Call us · 207 770-6945
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
