"use client";

import { useId, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { MAPLE_LEAF_MARKUP, MAPLE_LEAF_VIEWBOX } from "./mapleLeaf";

/**
 * Gently falling autumn leaves, pure CSS (transform-only keyframes, no canvas,
 * no library). Absolutely positioned inside a `relative overflow-hidden`
 * parent. Honours prefers-reduced-motion (renders nothing) and stays light:
 * a dozen leaves on desktop, fewer on phones.
 *
 * The leaf itself is the maple leaf from the LottieFiles animation Aitor picked
 * (2026-10-27), extracted as one <symbol> (fill + veins) and reused by every
 * leaf via <use>, so the markup cost is paid once, not 14 times.
 *
 * `density` 0.5–1.5 scales the number of leaves.
 * `fixed` pins the layer to the viewport (site-wide seasonal overlay) instead
 * of filling its parent; `fade` scales every leaf's opacity (0–1).
 */
export function FallingLeaves({
  density = 1,
  className = "",
  fixed = false,
  fade = 1,
}: {
  density?: number;
  className?: string;
  fixed?: boolean;
  fade?: number;
}) {
  const reduce = useReducedMotion();
  // Unique symbol id per instance, so two layers on one page never clash.
  const symbolId = `maple-leaf${useId().replace(/:/g, "")}`;
  const leaves = useMemo(() => {
    const colors = ["#B85C3E", "#C8782F", "#E2B341", "#8E4A2E", "#A86B3C"];
    const count = Math.round(14 * density);
    // Deterministic pseudo-random so server and client render the same markup.
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, (_, i) => ({
      left: `${Math.round(rnd() * 100)}%`,
      size: 18 + Math.round(rnd() * 22),
      duration: 11 + rnd() * 10,
      delay: -rnd() * 20,
      sway: 2.5 + rnd() * 3,
      spin: 4 + rnd() * 6,
      color: colors[i % colors.length],
      flip: rnd() > 0.5 ? -1 : 1,
      opacity: (0.45 + rnd() * 0.35) * fade,
    }));
  }, [density, fade]);

  if (reduce) return null;

  return (
    <div
      className={`pointer-events-none ${fixed ? "fixed z-30" : "absolute"} inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes leaf-fall { 0% { transform: translate3d(0, -12vh, 0); } 100% { transform: translate3d(0, 110vh, 0); } }
        @keyframes leaf-sway { 0%, 100% { transform: translateX(-28px); } 50% { transform: translateX(28px); } }
        @keyframes leaf-spin { 0% { transform: rotate(0deg) scaleX(var(--flip)); } 100% { transform: rotate(360deg) scaleX(var(--flip)); } }
        .leaf-fall { position: absolute; top: 0; will-change: transform; animation: leaf-fall var(--dur) linear var(--delay) infinite; }
        .leaf-sway { animation: leaf-sway var(--sway) ease-in-out var(--delay) infinite alternate; }
        .leaf-spin { animation: leaf-spin var(--spin) linear var(--delay) infinite; }
        @media (max-width: 640px) { .leaf-fall:nth-child(n+8) { display: none; } }
      `}</style>
      {/* One hidden definition of the leaf; every falling leaf references it. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <symbol id={symbolId} viewBox={MAPLE_LEAF_VIEWBOX} dangerouslySetInnerHTML={{ __html: MAPLE_LEAF_MARKUP }} />
      </svg>
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
            <svg
              className="leaf-spin"
              viewBox={MAPLE_LEAF_VIEWBOX}
              width={l.size}
              height={l.size}
              style={{ color: l.color }}
            >
              <use href={`#${symbolId}`} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
