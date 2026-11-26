"use client";

import { useId, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

/** Six-armed snow crystal on a 24×24 grid, drawn with strokes only. */
export const SNOWFLAKE_PATH =
  "M12 12L22 12M17.2 12L18.5 9.75M17.2 12L18.5 14.25M20 12L20.95 10.35M20 12L20.95 13.65M12 12L17 20.66M14.6 16.5L17.2 16.5M14.6 16.5L13.3 18.75M16 18.93L17.9 18.93M16 18.93L15.05 20.57M12 12L7 20.66M9.4 16.5L10.7 18.75M9.4 16.5L6.8 16.5M8 18.93L8.95 20.57M8 18.93L6.1 18.93M12 12L2 12M6.8 12L5.5 14.25M6.8 12L5.5 9.75M4 12L3.05 13.65M4 12L3.05 10.35M12 12L7 3.34M9.4 7.5L6.8 7.5M9.4 7.5L10.7 5.25M8 5.07L6.1 5.07M8 5.07L8.95 3.43M12 12L17 3.34M14.6 7.5L13.3 5.25M14.6 7.5L17.2 7.5M16 5.07L15.05 3.43M16 5.07L17.9 5.07";

/**
 * Gently falling snow, the winter twin of FallingLeaves: pure CSS
 * (transform-only keyframes, no canvas, no library), honours
 * prefers-reduced-motion (renders nothing) and thins out on phones.
 *
 * A mix of drawn crystals and soft round flakes. The site is mostly cream, so
 * white snow would vanish: flakes are an icy blue-grey that reads on cream
 * and still looks like snow over the dark sections.
 *
 * `density` scales the number of flakes; `fixed` pins the layer to the
 * viewport (site-wide seasonal overlay); `fade` scales every flake's opacity.
 */
export function FallingSnow({
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
  const symbolId = `snowflake${useId().replace(/:/g, "")}`;
  const flakes = useMemo(() => {
    const colors = ["#8FAEC2", "#A3BDCD", "#7F9FB5", "#B4CAD6"];
    const count = Math.round(26 * density);
    // Deterministic pseudo-random so server and client render the same markup.
    let seed = 11;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, (_, i) => {
      const crystal = i % 3 !== 2; // two crystals for every round flake
      return {
        crystal,
        left: `${Math.round(rnd() * 100)}%`,
        size: crystal ? 12 + Math.round(rnd() * 14) : 4 + Math.round(rnd() * 5),
        duration: 13 + rnd() * 12,
        delay: -rnd() * 25,
        sway: 3 + rnd() * 3.5,
        spin: 9 + rnd() * 12,
        color: colors[i % colors.length],
        opacity: (0.5 + rnd() * 0.4) * fade,
      };
    });
  }, [density, fade]);

  if (reduce) return null;

  return (
    <div
      className={`pointer-events-none ${fixed ? "fixed z-30" : "absolute"} inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes snow-fall { 0% { transform: translate3d(0, -8vh, 0); } 100% { transform: translate3d(0, 108vh, 0); } }
        @keyframes snow-sway { 0%, 100% { transform: translateX(-18px); } 50% { transform: translateX(18px); } }
        @keyframes snow-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .snow-fall { position: absolute; top: 0; will-change: transform; animation: snow-fall var(--dur) linear var(--delay) infinite; }
        .snow-sway { animation: snow-sway var(--sway) ease-in-out var(--delay) infinite alternate; }
        .snow-spin { display: block; animation: snow-spin var(--spin) linear var(--delay) infinite; }
        @media (max-width: 640px) { .snow-fall:nth-child(n+16) { display: none; } }
      `}</style>
      {/* One hidden definition of the crystal; every flake references it. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <symbol id={symbolId} viewBox="0 0 24 24">
          <path d={SNOWFLAKE_PATH} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </symbol>
      </svg>
      {flakes.map((f, i) => (
        <div
          key={i}
          className="snow-fall"
          style={{
            left: f.left,
            ["--dur" as string]: `${f.duration.toFixed(1)}s`,
            ["--delay" as string]: `${f.delay.toFixed(1)}s`,
            ["--sway" as string]: `${f.sway.toFixed(1)}s`,
            ["--spin" as string]: `${f.spin.toFixed(1)}s`,
            opacity: f.opacity,
          }}
        >
          <div className="snow-sway">
            {f.crystal ? (
              <svg className="snow-spin" viewBox="0 0 24 24" width={f.size} height={f.size} style={{ color: f.color }}>
                <use href={`#${symbolId}`} />
              </svg>
            ) : (
              <span
                className="block rounded-full"
                style={{
                  width: f.size,
                  height: f.size,
                  background: "#FFFFFF",
                  boxShadow: `0 0 0 1px ${f.color}`,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
