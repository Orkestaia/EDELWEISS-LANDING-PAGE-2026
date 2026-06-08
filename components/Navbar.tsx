"use client";

import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";
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

  // Cartel oscila como un péndulo según la velocidad del scroll.
  // Más velocidad → más balanceo. Spring suaviza la vuelta al reposo.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 22,
    stiffness: 130,
    mass: 0.8,
  });
  const signRotate = useTransform(smoothVelocity, [-2000, 0, 2000], [7, 0, -7]);

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
        <div className="flex h-20 sm:h-24 items-center justify-between">
          {/* Logo: the carved Edelweiss Pastry Shop sign — appears to hang
              from the top of the navbar. Swings pendulum-style with scroll
              velocity, plus a subtle hover tilt. mix-blend-multiply removes
              any residual white halo from the PNG against the cream bg. */}
          <Link
            href="/"
            aria-label="Edelweiss Pastry Shop — home"
            className="group relative -mt-1 sm:-mt-2 block"
          >
            <motion.div
              style={{ rotate: signRotate, transformOrigin: "50% 0%" }}
              className="group-hover:[transform:rotate(-1.2deg)] transition-transform duration-700 ease-out"
            >
              <Image
                src="/images/edelweiss-sign.png"
                alt="Edelweiss Pastry Shop"
                width={180}
                height={135}
                priority
                className="w-28 sm:w-36 lg:w-44 h-auto select-none drop-shadow-sm [mix-blend-mode:multiply]"
              />
            </motion.div>
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
