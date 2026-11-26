"use client";

import { FallingLeaves } from "./FallingLeaves";
import { FallingSnow } from "./FallingSnow";
import { useSeason } from "@/lib/season";

/**
 * Site-wide seasonal layer: a light, fixed overlay falling over the whole
 * page, below the navbar (z-40) and every popup. Autumn leaves until
 * Thanksgiving, then snow through the holidays (dates in lib/season.ts), so
 * it changes and switches itself off with no code change. Reduced-motion
 * visitors see nothing (handled in FallingLeaves / FallingSnow).
 */
export function SeasonalLeaves() {
  const season = useSeason();
  if (season === "winter") return <FallingSnow fixed density={0.85} fade={0.9} />;
  if (season === "autumn") return <FallingLeaves fixed density={0.5} fade={0.75} />;
  return null;
}
