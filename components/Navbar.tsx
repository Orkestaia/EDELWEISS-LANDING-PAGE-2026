"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { EdelweissMark } from "./EdelweissMark";

const nav = [
  { href: "#shop", label: "Shop" },
  { href: "#heritage", label: "Heritage" },
  { href: "#ordering", label: "Ordering" },
  { href: "#visit", label: "Visit" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/90 backdrop-blur-md border-b border-cocoa/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link
            href="#top"
            className="flex items-center gap-3 text-cocoa hover:text-forest transition-colors"
          >
            <EdelweissMark size={28} className="text-forest" />
            <span className="font-display text-xl sm:text-2xl leading-none tracking-wide">
              Edelweiss
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm tracking-[0.18em] uppercase text-cocoa/80">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hover:text-rust transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-cocoa text-cream-50 px-5 py-2.5 text-sm tracking-[0.18em] uppercase hover:bg-rust transition-colors"
            >
              Order online
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-cocoa"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-cream-50 border-t border-cocoa/10">
          <div className="px-5 py-6 flex flex-col gap-5">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-cocoa text-sm tracking-[0.2em] uppercase"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#order"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-cocoa text-cream-50 px-5 py-3 text-sm tracking-[0.2em] uppercase"
            >
              Order online
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
