"use client";

import { useEffect, useState } from "react";
import { FallingLeaves } from "./FallingLeaves";
import { maineToday } from "@/lib/closures";

/**
 * Site-wide autumn leaves: a light, fixed layer of falling maple leaves over
 * the whole page, below the navbar (z-40) and every popup. Only shown between
 * AUTUMN_FROM and AUTUMN_UNTIL (Maine dates), so it switches itself off after
 * November with no code change. Checked in the browser because the page is
 * prerendered. Reduced-motion visitors see nothing (handled in FallingLeaves).
 */
const AUTUMN_FROM = "2026-10-27";
const AUTUMN_UNTIL = "2026-11-30";

export function SeasonalLeaves() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const today = maineToday();
    setOn(today >= AUTUMN_FROM && today <= AUTUMN_UNTIL);
  }, []);
  if (!on) return null;
  return <FallingLeaves fixed density={0.5} fade={0.75} />;
}
