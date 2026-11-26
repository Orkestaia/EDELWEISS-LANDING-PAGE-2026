"use client";

import { useEffect, useState } from "react";
import { FallingLeaves } from "./FallingLeaves";
import { FallingSnow } from "./FallingSnow";
import { maineToday } from "@/lib/closures";

/**
 * Site-wide seasonal layer: a light, fixed overlay falling over the whole
 * page, below the navbar (z-40) and every popup. Autumn leaves until
 * Thanksgiving, then snow through the holidays (Maine dates), so it changes
 * and switches itself off with no code change. Checked in the browser because
 * the page is prerendered. Reduced-motion visitors see nothing (handled in
 * FallingLeaves / FallingSnow).
 */
const AUTUMN_FROM = "2026-10-27";
const AUTUMN_UNTIL = "2026-11-25";
// Christmas look from the day the Christmas menu goes up until Epiphany.
const WINTER_FROM = "2026-11-26";
const WINTER_UNTIL = "2027-01-06";

export function SeasonalLeaves() {
  const [season, setSeason] = useState<"autumn" | "winter" | null>(null);
  useEffect(() => {
    const today = maineToday();
    const preview = new URLSearchParams(window.location.search).get("preview");
    if (preview === "christmas" || (today >= WINTER_FROM && today <= WINTER_UNTIL)) setSeason("winter");
    else if (today >= AUTUMN_FROM && today <= AUTUMN_UNTIL) setSeason("autumn");
  }, []);
  if (season === "winter") return <FallingSnow fixed density={0.85} fade={0.9} />;
  if (season === "autumn") return <FallingLeaves fixed density={0.5} fade={0.75} />;
  return null;
}
