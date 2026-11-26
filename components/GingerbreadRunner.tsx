"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useSeason } from "@/lib/season";

/**
 * A gingerbread man who tumbles across the home page for fun during the
 * Christmas season: in from the left, a little dance in the middle, and out
 * to the right. He passes in front of everything but never blocks a click
 * (pointer-events: none).
 *
 * The figure is the gingerbread man from the GIF Aitor picked (2026-11-26),
 * cut out of one frame onto a transparent background; the GIF's own movement
 * (roll in, wobble, jump out) is redone in CSS so he can cross the whole
 * screen instead of a 512px box. Transform-only animation.
 *
 * First pass a few seconds after the page loads, then one every REPEAT_MS
 * while the tab stays visible, up to MAX_RUNS per visit. Off for
 * reduced-motion visitors and outside the season (lib/season.ts).
 */
const FIRST_DELAY_MS = 3500;
const REPEAT_MS = 75_000;
const MAX_RUNS = 4;
const DURATION_S = 8;

export function GingerbreadRunner() {
  const season = useSeason();
  const reduce = useReducedMotion();
  // 0 = resting off-screen; every new number is one pass (remounts the animation).
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);
  const active = season === "winter" && !reduce;

  useEffect(() => {
    if (!active) return;
    let runs = 0;
    let timer: number;
    const go = () => {
      if (document.visibilityState === "visible") {
        runs += 1;
        setRun(runs);
        setRunning(true);
      }
      if (runs < MAX_RUNS) timer = window.setTimeout(go, REPEAT_MS);
    };
    timer = window.setTimeout(go, FIRST_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!active || !running) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[12vh] z-[95] h-0" aria-hidden="true">
      <style>{`
        @keyframes ginger-cross {
          0%   { transform: translate3d(-30vw, 0, 0); }
          36%  { transform: translate3d(40vw, 0, 0); }
          62%  { transform: translate3d(46vw, 0, 0); }
          100% { transform: translate3d(118vw, 0, 0); }
        }
        @keyframes ginger-hop {
          0%, 36%  { transform: translateY(0); }
          42%      { transform: translateY(-34px); }
          48%      { transform: translateY(0); }
          54%      { transform: translateY(-34px); }
          60%      { transform: translateY(0); }
          68%      { transform: translateY(-70px); }
          80%, 100% { transform: translateY(0); }
        }
        /* The cut-out leans about 22deg to the left, so 22deg stands him upright. */
        @keyframes ginger-roll {
          0%   { transform: rotate(-338deg); }
          36%  { transform: rotate(22deg); }
          42%  { transform: rotate(12deg); }
          48%  { transform: rotate(32deg); }
          54%  { transform: rotate(12deg); }
          62%  { transform: rotate(22deg); }
          100% { transform: rotate(382deg); }
        }
        .ginger-cross { animation: ginger-cross ${DURATION_S}s cubic-bezier(0.4, 0, 0.6, 1) forwards; will-change: transform; }
        .ginger-hop { animation: ginger-hop ${DURATION_S}s ease-in-out forwards; }
        .ginger-roll { animation: ginger-roll ${DURATION_S}s cubic-bezier(0.4, 0, 0.6, 1) forwards; }
      `}</style>
      <div key={run} className="ginger-cross absolute bottom-0 left-0" onAnimationEnd={(e) => {
        if (e.animationName === "ginger-cross") setRunning(false);
      }}>
        <div className="ginger-hop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/christmas/gingerbread.webp"
            alt=""
            width={350}
            height={350}
            className="ginger-roll block h-28 w-28 select-none sm:h-36 sm:w-36 lg:h-44 lg:w-44"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
