"use client";

import { useState } from "react";
import { ArrowRight, Check, Gift } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Tone = "dark" | "light";

/**
 * Shared newsletter signup form. Captures first name, email and birthday
 * (month + day — no year, to keep friction low; Brevo's anniversary
 * automation only needs the month/day). Posts to /api/subscribe, which adds
 * the contact to Brevo and triggers the welcome-recipe email.
 *
 * `tone="dark"` for placement on the dark forest section (light text),
 * `tone="light"` for the cream popup (dark text).
 */
export function SubscribeForm({
  tone = "dark",
  compact = false,
}: {
  tone?: Tone;
  compact?: boolean;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const dark = tone === "dark";
  const fieldBase =
    "w-full rounded-full px-5 py-3.5 text-sm focus:outline-none transition-colors";
  const fieldTone = dark
    ? "bg-cream-50/10 border border-cream-50/25 text-cream-50 placeholder:text-cream-50/45 focus:border-mustard focus:bg-cream-50/15"
    : "bg-cocoa/[0.04] border border-cocoa/15 text-cocoa placeholder:text-cocoa/40 focus:border-forest focus:bg-cocoa/[0.06]";
  const selectTone = dark
    ? "bg-forest border border-cream-50/25 text-cream-50 focus:border-mustard"
    : "bg-cream-50 border border-cocoa/15 text-cocoa focus:border-forest";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          birthdayMonth: month,
          birthdayDay: day,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`flex flex-col items-center text-center gap-3 ${
          dark ? "text-cream-50" : "text-cocoa"
        }`}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            dark ? "bg-mustard text-cocoa" : "bg-forest text-cream-50"
          }`}
        >
          <Check size={22} />
        </span>
        <p className="font-display text-2xl leading-tight">
          Welcome to Edelweiss!
        </p>
        <p className={`text-sm ${dark ? "text-cream-50/80" : "text-cocoa/70"}`}>
          Your seasonal recipe is on its way to your inbox. And we&apos;ll have
          a little something for you on your birthday.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <div>
          <label htmlFor={`sf-name-${tone}`} className="sr-only">
            First name
          </label>
          <input
            id={`sf-name-${tone}`}
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className={`${fieldBase} ${fieldTone}`}
          />
        </div>
        <div>
          <label htmlFor={`sf-email-${tone}`} className="sr-only">
            Email address
          </label>
          <input
            id={`sf-email-${tone}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@inbox.com"
            className={`${fieldBase} ${fieldTone}`}
          />
        </div>
      </div>

      {/* Birthday */}
      <div>
        <div
          className={`mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] ${
            dark ? "text-mustard" : "text-forest"
          }`}
        >
          <Gift size={13} />
          Your birthday — for a little gift
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            aria-label="Birth month"
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={`${fieldBase} ${selectTone} appearance-none cursor-pointer`}
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1)}>
                {m}
              </option>
            ))}
          </select>
          <select
            aria-label="Birth day"
            required
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={`${fieldBase} ${selectTone} appearance-none cursor-pointer`}
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={String(d)}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Consent */}
      <label
        className={`flex items-start gap-2.5 text-xs leading-snug ${
          dark ? "text-cream-50/70" : "text-cocoa/65"
        }`}
      >
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-mustard cursor-pointer"
        />
        <span>
          I&apos;d like to receive occasional emails from Edelweiss — recipes,
          seasonal news and offers. Unsubscribe anytime.
        </span>
      </label>

      {status === "error" && (
        <p className="text-xs text-rust">
          {errorMsg}. Please try again, or email info@edelweissconfections.com.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm uppercase tracking-[0.2em] transition-colors disabled:opacity-60 ${
          dark
            ? "bg-mustard text-cocoa hover:bg-cream-50"
            : "bg-cocoa text-cream-50 hover:bg-rust"
        }`}
      >
        {status === "loading" ? "Sending…" : "Send me my recipe"}
        {status !== "loading" && (
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </button>
    </form>
  );
}
