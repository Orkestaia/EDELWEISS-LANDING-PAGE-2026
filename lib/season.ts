"use client";

import { useEffect, useState } from "react";
import { maineToday } from "./closures";

/**
 * SEASONAL LOOK — one place for the dates of the site-wide seasonal dressing
 * (falling leaves / snow, Christmas decoration in the hero). Maine dates, so
 * everything switches itself on and off with no code change.
 */
export const AUTUMN = { from: "2026-10-27", until: "2026-11-25" } as const;
// Christmas look from the day the Christmas menu goes up until Epiphany.
export const WINTER = { from: "2026-11-26", until: "2027-01-06" } as const;

export type Season = "autumn" | "winter" | null;

export function seasonFor(today: string): Season {
  if (today >= WINTER.from && today <= WINTER.until) return "winter";
  if (today >= AUTUMN.from && today <= AUTUMN.until) return "autumn";
  return null;
}

/**
 * Current season, resolved in the browser (pages are prerendered, so a
 * build-time date would go stale). Null on the server and on first paint.
 * `?preview=christmas` forces winter outside the window.
 */
export function useSeason(): Season {
  const [season, setSeason] = useState<Season>(null);
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview");
    setSeason(preview === "christmas" ? "winter" : seasonFor(maineToday()));
  }, []);
  return season;
}
