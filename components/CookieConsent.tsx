"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "all" | "essential") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f5f0e8] px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-[#3a322c]">
          We use cookies to run our site and, with your permission, to
          understand site traffic and measure our ads. See our{" "}
          <Link href="/cookies" className="underline underline-offset-2">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex w-full shrink-0 gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="flex-1 rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-[#3a322c] transition hover:bg-black/5 sm:flex-none"
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="flex-1 rounded-full bg-[#3a322c] px-4 py-2 text-sm font-medium text-[#f5f0e8] transition hover:bg-[#2a241f] sm:flex-none"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
