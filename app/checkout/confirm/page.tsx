"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, XCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice } from "@/lib/cart";

interface OrderData {
  name: string;
  email: string;
  pickupDate: string;
  pickupSlot: string;
  total: number;
}

function prettyDate(value: string) {
  const d = new Date(`${value}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function slotLabel(slot: string) {
  const h = parseInt(slot.slice(0, 2), 10);
  if (h === 12) return "12:00 PM";
  if (h > 12) return `${h - 12}:00 PM`;
  return `${h}:00 AM`;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-cocoa/10 last:border-0">
      <span className="text-xs uppercase tracking-[0.2em] text-cocoa/55">{label}</span>
      <span className={`tabular-nums ${strong ? "font-display text-xl text-cocoa" : "text-cocoa/85"}`}>
        {value}
      </span>
    </div>
  );
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("edelweiss_order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
        sessionStorage.removeItem("edelweiss_order");
      } catch {}
    }
  }, []);

  // Estado de cancelación si Clover redirige sin pago completado.
  const cancelled = searchParams.get("cancelled") === "true";

  if (cancelled) {
    return (
      <main className="min-h-screen bg-cream-50">
        <Navbar />
        <section className="mx-auto max-w-2xl px-5 sm:px-8 pt-36 pb-28 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rust/10 text-rust">
            <XCircle size={34} />
          </div>
          <h1 className="mt-8 font-display text-4xl sm:text-5xl text-cocoa leading-[1.05]">
            Payment cancelled.
          </h1>
          <p className="mt-5 text-cocoa/70 leading-relaxed">
            No charge was made. Your cart items are still available — just head back and try again.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/#shop"
              className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-rust transition-colors"
            >
              Back to the menu
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <section className="mx-auto max-w-2xl px-5 sm:px-8 pt-36 pb-28 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest text-cream-50"
        >
          <Check size={34} />
        </motion.div>

        <h1 className="mt-8 font-display text-4xl sm:text-5xl text-cocoa leading-[1.05]">
          {order ? (
            <>
              Your order is confirmed,
              <span className="block italic text-forest">{order.name.split(" ")[0]}.</span>
            </>
          ) : (
            "Your order is confirmed."
          )}
        </h1>

        <p className="mt-5 text-cocoa/75 leading-relaxed">
          Payment received. We&apos;ll have everything freshly packed and ready
          for you. Just show your name at the counter.
        </p>

        <div className="mt-10 mx-auto max-w-sm rounded-2xl bg-cream-100 border border-cocoa/10 p-7 text-left">
          {orderId && (
            <Row label="Order #" value={orderId.slice(-8).toUpperCase()} />
          )}
          {order && (
            <>
              <Row label="Pick-up" value={prettyDate(order.pickupDate)} />
              <Row label="Time" value={slotLabel(order.pickupSlot)} />
              <Row label="Total" value={formatPrice(order.total)} strong />
            </>
          )}
          <div className="mt-4 pt-4 border-t border-cocoa/10 text-sm text-cocoa/60">
            5 Alfred Street #103, Biddeford, ME 04005
          </div>
        </div>

        {order?.email && (
          <p className="mt-6 text-sm text-cocoa/55">
            A confirmation is on its way to {order.email}.
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-rust transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/#shop"
            className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 text-cocoa px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-cocoa hover:text-cream-50 transition-colors"
          >
            Order more
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmContent />
    </Suspense>
  );
}
