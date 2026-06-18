"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EdelweissMark } from "@/components/EdelweissMark";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  Phone,
  Mail,
  Download,
  ArrowUpRight,
} from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

const EVENT_TYPES = [
  "Birthday celebration",
  "Wedding / Engagement",
  "Corporate / Office event",
  "Holiday gathering",
  "Other",
];

const BUSINESS_TYPES = [
  "Restaurant",
  "Café / Coffee shop",
  "Hotel / B&B",
  "Grocery / Market",
  "Other",
];

function SpecialOrderForm() {
  const [state, setState] = useState<FormState>("idle");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });

  const set = (k: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "special", ...fields }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-forest/10 border border-forest/20 p-8 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/15 text-forest mb-4">
          <Check size={24} />
        </div>
        <h3 className="font-display text-2xl text-cocoa">Message received!</h3>
        <p className="mt-2 text-cocoa/70 text-sm leading-relaxed">
          We'll be in touch within 24 hours. For urgent requests, call us at{" "}
          <a href="tel:+12077706945" className="text-rust underline underline-offset-2">
            207 770-6945
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Your name *
          </label>
          <input
            required
            value={fields.name}
            onChange={set("name")}
            placeholder="Jane Smith"
            className="cf-input"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Email *
          </label>
          <input
            required
            type="email"
            value={fields.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            className="cf-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={set("phone")}
            placeholder="207 555-0123"
            className="cf-input"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Type of event
          </label>
          <select value={fields.eventType} onChange={set("eventType")} className="cf-input">
            <option value="">Select…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Event date (if known)
          </label>
          <input
            type="date"
            value={fields.eventDate}
            onChange={set("eventDate")}
            className="cf-input"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Approx. number of guests
          </label>
          <input
            type="number"
            min="1"
            value={fields.guestCount}
            onChange={set("guestCount")}
            placeholder="25"
            className="cf-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
          Tell us about your order *
        </label>
        <textarea
          required
          rows={5}
          value={fields.message}
          onChange={set("message")}
          placeholder="Describe what you have in mind — pastries, flavors, quantities, dietary needs…"
          className="cf-input resize-none"
        />
      </div>

      {state === "error" && (
        <p className="text-rust text-sm">
          Something went wrong — please try again or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-xs uppercase tracking-[0.22em] hover:bg-rust transition-colors disabled:opacity-60"
      >
        {state === "submitting" && <Loader2 size={14} className="animate-spin" />}
        Send request
      </button>
    </form>
  );
}

function WholesaleForm() {
  const [state, setState] = useState<FormState>("idle");
  const [fields, setFields] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });

  const set = (k: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "wholesale", ...fields }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-forest/10 border border-forest/20 p-8 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/15 text-forest mb-4">
          <Check size={24} />
        </div>
        <h3 className="font-display text-2xl text-cocoa">Thank you!</h3>
        <p className="mt-2 text-cocoa/70 text-sm leading-relaxed">
          We'll send you our full wholesale menu and pricing within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Business name *
          </label>
          <input
            required
            value={fields.businessName}
            onChange={set("businessName")}
            placeholder="The Corner Café"
            className="cf-input"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Your name *
          </label>
          <input
            required
            value={fields.contactName}
            onChange={set("contactName")}
            placeholder="John Doe"
            className="cf-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Business email *
          </label>
          <input
            required
            type="email"
            value={fields.email}
            onChange={set("email")}
            placeholder="hello@yourcafe.com"
            className="cf-input"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={set("phone")}
            placeholder="207 555-0456"
            className="cf-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
          Type of business
        </label>
        <select value={fields.businessType} onChange={set("businessType")} className="cf-input">
          <option value="">Select…</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.18em] text-cocoa/60 mb-1.5">
          What are you interested in? *
        </label>
        <textarea
          required
          rows={4}
          value={fields.message}
          onChange={set("message")}
          placeholder="Tell us which products you're looking for, approximate weekly quantities, and anything else we should know…"
          className="cf-input resize-none"
        />
      </div>

      {state === "error" && (
        <p className="text-rust text-sm">
          Something went wrong — please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-xs uppercase tracking-[0.22em] hover:bg-rust transition-colors disabled:opacity-60"
      >
        {state === "submitting" && <Loader2 size={14} className="animate-spin" />}
        Send inquiry
      </button>
    </form>
  );
}

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-forest">
          <EdelweissMark size={24} />
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-cocoa/60">
            Special orders & wholesale
          </span>
        </div>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl text-cocoa leading-[1.04] max-w-3xl">
          Let's make something
          <span className="block italic text-forest"> extraordinary.</span>
        </h1>
        <p className="mt-6 text-cocoa/70 text-lg leading-relaxed max-w-xl">
          For birthdays, weddings, and occasions that deserve more than a
          standard order — or if you run a business that wants Edelweiss on
          your shelves — we're here.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-cocoa/10" />

      {/* Special Events section */}
      <section id="special" className="py-20 sm:py-28 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — info */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-rust" />
              Special events
            </span>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-cocoa leading-[1.05]">
              Custom orders
              <span className="block italic text-forest"> for any occasion.</span>
            </h2>
            <p className="mt-5 text-cocoa/70 leading-relaxed">
              Birthdays, office gatherings, weddings, holiday parties — if you
              need quantities or a specific creation beyond what our online shop
              offers, get in touch. We'll work out the details together.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest text-xs font-display">
                  01
                </span>
                <div>
                  <p className="font-display text-lg text-cocoa">Send us a message</p>
                  <p className="text-sm text-cocoa/65 mt-0.5">
                    Describe your event, quantities, and any special requests.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest text-xs font-display">
                  02
                </span>
                <div>
                  <p className="font-display text-lg text-cocoa">We confirm and plan the bake</p>
                  <p className="text-sm text-cocoa/65 mt-0.5">
                    We reply within 24 hours to confirm availability and pricing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest text-xs font-display">
                  03
                </span>
                <div>
                  <p className="font-display text-lg text-cocoa">Pick up fresh</p>
                  <p className="text-sm text-cocoa/65 mt-0.5">
                    Everything ready on the agreed date at 5 Alfred Street.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 pt-8 border-t border-cocoa/10">
              <p className="text-xs uppercase tracking-[0.2em] text-cocoa/50">
                Or reach us directly
              </p>
              <a
                href="tel:+12077706945"
                className="inline-flex items-center gap-2 text-cocoa hover:text-rust transition-colors"
              >
                <Phone size={14} />
                <span className="text-sm">207 770-6945</span>
              </a>
              <a
                href="mailto:info@edelweissconfections.com"
                className="inline-flex items-center gap-2 text-cocoa hover:text-rust transition-colors"
              >
                <Mail size={14} />
                <span className="text-sm">info@edelweissconfections.com</span>
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7 rounded-3xl border border-cocoa/10 bg-cream-100/60 p-8 sm:p-10">
            <SpecialOrderForm />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-cocoa/10" />

      {/* Wholesale section */}
      <section id="wholesale" className="py-20 sm:py-28 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — info */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-mustard" />
              Wholesale
            </span>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-cocoa leading-[1.05]">
              Bring Edelweiss
              <span className="block italic text-forest"> to your business.</span>
            </h2>
            <p className="mt-5 text-cocoa/70 leading-relaxed">
              Restaurants, cafés, hotels, and specialty markets — we partner
              with local businesses who share our commitment to quality. Our
              artisan pastries, breads, and chocolates are baked fresh and
              available for wholesale delivery in the Biddeford–Portland area.
            </p>

            <div className="mt-8 rounded-2xl border border-cocoa/10 p-6 bg-cream-50">
              <p className="text-xs uppercase tracking-[0.2em] text-cocoa/50 mb-4">
                Our wholesale catalogue
              </p>
              <p className="text-sm text-cocoa/70 leading-relaxed mb-5">
                Download our current menu with wholesale pricing. We update it
                seasonally — reach out to confirm availability.
              </p>
              <a
                href="/wholesale-menu.pdf"
                download="Edelweiss-Wholesale-Menu.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 text-cocoa px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-cocoa hover:text-cream-50 transition-colors"
              >
                <Download size={13} />
                Download price list
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7 rounded-3xl border border-cocoa/10 bg-cream-100/60 p-8 sm:p-10">
            <WholesaleForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
