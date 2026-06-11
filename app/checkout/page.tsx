"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart, formatPrice } from "@/lib/cart";
import { trackBeginCheckout } from "@/lib/analytics";

type Status = "idle" | "submitting" | "error";

/** Genera las próximas ~14 fechas válidas (sin lunes). */
function buildPickupDates() {
  const out: { value: string; label: string; weekday: number }[] = [];
  const today = new Date();
  for (let i = 0; i < 24 && out.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 1) continue; // lunes cerrado
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    out.push({ value, label, weekday: d.getDay() });
  }
  return out;
}

function slotsForWeekday(weekday: number) {
  const start = weekday === 0 || weekday === 6 ? 8 : 7; // sáb/dom abren a las 8
  const slots: string[] = [];
  for (let h = start; h <= 13; h++) slots.push(`${String(h).padStart(2, "0")}:00`);
  return slots;
}

function slotLabel(slot: string) {
  const h = parseInt(slot.slice(0, 2), 10);
  if (h === 12) return "12:00 PM";
  if (h > 12) return `${h - 12}:00 PM`;
  return `${h}:00 AM`;
}

function prettyDate(value: string) {
  const d = new Date(`${value}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CheckoutPage() {
  const { items, total, count, hydrated, clear } = useCart();
  const dates = useMemo(buildPickupDates, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(dates[0]?.value ?? "");
  const [pickupSlot, setPickupSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const slots = useMemo(() => {
    const wd = dates.find((d) => d.value === pickupDate)?.weekday ?? 2;
    return slotsForWeekday(wd);
  }, [pickupDate, dates]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/clover/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          pickupDate,
          pickupSlot,
          notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      // Guardamos datos del cliente para la página de confirmación.
      sessionStorage.setItem(
        "edelweiss_order",
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          pickupDate,
          pickupSlot,
          total: data.total,
        })
      );
      trackBeginCheckout(
        items.map((i) => ({
          name: i.name,
          slug: i.slug,
          price: i.price,
          quantity: i.quantity,
        })),
        total
      );
      clear();
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  // ─── Empty cart ─────────────────────────────────────────────────
  if (hydrated && count === 0) {
    return (
      <main className="min-h-screen bg-cream-50">
        <Navbar />
        <section className="mx-auto max-w-2xl px-5 sm:px-8 pt-36 pb-28 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cocoa/5 text-cocoa/40">
            <ShoppingBag size={26} />
          </div>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl text-cocoa">
            Your cart is empty.
          </h1>
          <p className="mt-4 text-cocoa/65">
            Add a few pastries and they&apos;ll show up here.
          </p>
          <Link
            href="/#shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-rust transition-colors"
          >
            Browse the counter
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  // ─── Checkout form ──────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-32 sm:pt-36 pb-24">
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 text-sm text-cocoa/60 hover:text-cocoa transition-colors"
        >
          <ArrowLeft size={15} /> Back to the menu
        </Link>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl text-cocoa leading-[1.05]">
          Reserve your
          <span className="italic text-forest"> pick-up.</span>
        </h1>
        <p className="mt-4 max-w-xl text-cocoa/70 leading-relaxed">
          Tell us who you are and when you&apos;ll swing by. We&apos;ll have it
          freshly packed and ready — secure card payment on the next step.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            <fieldset className="space-y-4" disabled={status === "submitting"}>
              <legend className="font-display text-2xl text-cocoa mb-2">
                Your details
              </legend>
              <Field label="Full name" required>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cf-input"
                  placeholder="Jane Doe"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="cf-input"
                    placeholder="jane@inbox.com"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="cf-input"
                    placeholder="(207) 555-0123"
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4" disabled={status === "submitting"}>
              <legend className="font-display text-2xl text-cocoa mb-2">
                Pick-up time
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date" required>
                  <select
                    required
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);
                      setPickupSlot("");
                    }}
                    className="cf-input"
                  >
                    {dates.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Time" required>
                  <select
                    required
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="cf-input"
                  >
                    <option value="" disabled>
                      Choose a time…
                    </option>
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {slotLabel(s)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Notes for the bakery (optional)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="cf-input resize-none"
                  placeholder="Allergies, a specific time inside the hour, a message…"
                />
              </Field>
              <p className="flex items-center gap-2 text-xs text-cocoa/55">
                <Clock size={13} /> Pick-up Tuesday–Sunday, 7am–2pm. Closed
                Mondays.
              </p>
            </fieldset>

            {error && (
              <div className="rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting" || !pickupSlot}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-cocoa text-cream-50 px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-rust transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Placing order…
                </>
              ) : (
                <>Pay online · {formatPrice(total)}</>
              )}
            </button>
          </form>

          {/* Order summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-cream-100 border border-cocoa/10 p-7">
              <h2 className="font-display text-2xl text-cocoa">Your order</h2>
              <ul className="mt-5 space-y-4">
                {items.map((it) => (
                  <li key={it.slug} className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-50">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-cocoa leading-tight">
                        {it.name}
                      </div>
                      <div className="text-xs text-cocoa/55">
                        Qty {it.quantity}
                      </div>
                    </div>
                    <div className="font-display text-cocoa tabular-nums">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-cocoa/10 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-cocoa/60">
                  Total
                </span>
                <span className="font-display text-2xl text-cocoa tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-4 text-xs text-cocoa/55 leading-relaxed">
                Secure card payment on the next step via Clover. Your order
                will be ready for pick-up at the chosen time.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-cocoa/60 mb-2">
        {label}
        {required && <span className="text-rust"> *</span>}
      </span>
      {children}
    </label>
  );
}
