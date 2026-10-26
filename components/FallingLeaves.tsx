"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Gently falling autumn leaves, pure CSS (transform-only keyframes, no canvas,
 * no library). Absolutely positioned inside a `relative overflow-hidden`
 * parent. Honours prefers-reduced-motion (renders nothing) and stays light:
 * a dozen leaves on desktop, fewer on phones.
 *
 * `density` 0.5–1.5 scales the number of leaves; `tone` picks the palette.
 */
export function FallingLeaves({
  density = 1,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const leaves = useMemo(() => {
    const colors = ["#B85C3E", "#C8782F", "#E2B341", "#8E4A2E", "#A86B3C"];
    const count = Math.round(14 * density);
    // Deterministic pseudo-random so server and client render the same markup.
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, (_, i) => ({
      left: `${Math.round(rnd() * 100)}%`,
      size: 14 + Math.round(rnd() * 16),
      duration: 11 + rnd() * 10,
      delay: -rnd() * 20,
      sway: 2.5 + rnd() * 3,
      spin: 4 + rnd() * 6,
      color: colors[i % colors.length],
      flip: rnd() > 0.5 ? -1 : 1,
      opacity: 0.45 + rnd() * 0.35,
    }));
  }, [density]);

  if (reduce) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <style>{`
        @keyframes leaf-fall { 0% { transform: translate3d(0, -12vh, 0); } 100% { transform: translate3d(0, 110vh, 0); } }
        @keyframes leaf-sway { 0%, 100% { transform: translateX(-28px); } 50% { transform: translateX(28px); } }
        @keyframes leaf-spin { 0% { transform: rotate(0deg) scaleX(var(--flip)); } 100% { transform: rotate(360deg) scaleX(var(--flip)); } }
        .leaf-fall { position: absolute; top: 0; will-change: transform; animation: leaf-fall var(--dur) linear var(--delay) infinite; }
        .leaf-sway { animation: leaf-sway var(--sway) ease-in-out var(--delay) infinite alternate; }
        .leaf-spin { animation: leaf-spin var(--spin) linear var(--delay) infinite; }
        @media (max-width: 640px) { .leaf-fall:nth-child(n+8) { display: none; } }
      `}</style>
      {leaves.map((l, i) => (
        <div
          key={i}
          className="leaf-fall"
          style={{
            left: l.left,
            ["--dur" as string]: `${l.duration.toFixed(1)}s`,
            ["--delay" as string]: `${l.delay.toFixed(1)}s`,
            ["--sway" as string]: `${l.sway.toFixed(1)}s`,
            ["--spin" as string]: `${l.spin.toFixed(1)}s`,
            ["--flip" as string]: `${l.flip}`,
            opacity: l.opacity,
          }}
        >
          <div className="leaf-sway">
            <svg className="leaf-spin" viewBox="0 0 64 64" width={l.size} height={l.size} fill={l.color}>
              {i % 3 === 0 ? (
                // maple
                <path d="M32 4c2 8 6 12 12 14-4 2-6 4-6 8 6-1 10 1 14 6-5 1-8 3-9 7 4 2 7 5 8 10-5-2-9-2-13 0 1 5 0 9-2 13-2-4-3-8-2-13-4 2-8 2-13 0 1-5 4-8 8-10-1-4-4-6-9-7 4-5 8-7 14-6 0-4-2-6-6-8 6-2 10-6 12-14z" />
              ) : i % 3 === 1 ? (
                // oak
                <path d="M32 6c5 3 7 8 6 13 5-1 9 1 11 5-4 2-6 5-5 9 5 1 8 4 9 8-5 1-8 4-9 8 3 3 4 7 2 11-5-1-9 0-12 3-3-3-7-4-12-3-2-4-1-8 2-11-1-4-4-7-9-8 1-4 4-7 9-8 1-4-1-7-5-9 2-4 6-6 11-5-1-5 1-10 6-13z" />
              ) : (
                // simple leaf with stem
                <path d="M34 4C14 10 6 26 10 48c14-2 26-12 30-30 2 10-2 20-10 30 10-8 16-20 14-34-2-6-6-9-10-10zM30 24l-10 26 2 1 10-26z" />
              )}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
