/**
 * Christmas decoration, pure inline SVG + CSS (no assets, no library):
 * a string of warm lights, fir sprigs with berries, a snow cap for cards and a
 * snowdrift edge. Everything is aria-hidden and pointer-events-none; the only
 * motion is a slow opacity twinkle on the bulbs, off for reduced-motion.
 */

/** Bulb colours: soft for dark backgrounds, deeper for the cream pages. */
const BULBS_ON_DARK = ["#F4C95D", "#D8573F", "#FFF1CC", "#9CC29A"];
const BULBS_ON_LIGHT = ["#E3A52C", "#C8473A", "#4E8A63", "#DB8430"];

/** A small fan of fir needles with two berries, hanging from (0, 5). */
const TUFT = (() => {
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = "";
  for (let i = 0; i < 9; i++) {
    const a = (Math.PI * (12 + i * 19.5)) / 180; // fan from lower-right round to lower-left
    const len = i % 2 ? 15 : 20;
    d += `M0 5L${r(len * Math.cos(a))} ${r(5 + len * Math.sin(a))}`;
  }
  return d;
})();

/**
 * A garland of lights hanging along the top edge of its `relative` parent
 * (or wherever `className` puts it). `wire` is the cable colour; `greenery`
 * adds a fir tuft with berries at every point where the cable is pinned;
 * `onLight` picks bulb colours that read on a cream background.
 */
export function StringLights({
  className = "",
  wire = "#12251C",
  greenery = false,
  onLight = false,
}: {
  className?: string;
  wire?: string;
  greenery?: boolean;
  onLight?: boolean;
}) {
  const palette = onLight ? BULBS_ON_LIGHT : BULBS_ON_DARK;
  const segments = 22; // 22 × 140px covers ultra-wide screens; the rest is clipped
  const bulbs = [
    { x: 28, y: 16.9 },
    { x: 70, y: 23 },
    { x: 112, y: 16.9 },
  ];
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 flex h-14 justify-center overflow-hidden ${className || "top-0"}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes xmas-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .xmas-bulb { animation: xmas-twinkle 3.6s ease-in-out infinite; }
        .xmas-bulb-1 { animation-delay: -1.2s; }
        .xmas-bulb-2 { animation-delay: -2.4s; }
        @media (prefers-reduced-motion: reduce) { .xmas-bulb { animation: none; } }
      `}</style>
      {Array.from({ length: segments }, (_, s) => (
        <svg key={s} width="140" height="56" viewBox="0 0 140 56" className="shrink-0 overflow-visible">
          <path d="M0 6 Q70 40 140 6" fill="none" stroke={wire} strokeWidth="1.6" />
          {greenery && (
            <g>
              <path d={TUFT} fill="none" stroke="#4E7A5C" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="-3.5" cy="8" r="3.4" fill="#C8473A" />
              <circle cx="4" cy="10" r="3" fill="#B53E33" />
            </g>
          )}
          {bulbs.map((b, i) => {
            const color = palette[(s * 3 + i) % palette.length];
            return (
              <g key={i} className={`xmas-bulb xmas-bulb-${(s + i) % 3}`}>
                <circle cx={b.x} cy={b.y + 10} r="13" fill={color} opacity={onLight ? 0.16 : 0.22} />
                <rect x={b.x - 2.5} y={b.y - 0.5} width="5" height="4.5" rx="1" fill="#C9B27A" />
                <ellipse cx={b.x} cy={b.y + 10} rx="4.6" ry="6.6" fill={color} />
                <ellipse cx={b.x - 1.4} cy={b.y + 7.6} rx="1.2" ry="2" fill="#FFFFFF" opacity="0.55" />
              </g>
            );
          })}
        </svg>
      ))}
    </div>
  );
}

/** Needles along a curved stem, computed once (deterministic, SSR-safe). */
function sprig(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  maxLen: number
): { stem: string; needles: string } {
  const r = (n: number) => Math.round(n * 10) / 10;
  let needles = "";
  for (let t = 0.08; t <= 0.985; t += 0.036) {
    const u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const angle = Math.atan2(dy, dx);
    const len = maxLen * (1 - t * 0.6);
    for (const side of [-1, 1]) {
      const a = angle + side * 0.82;
      needles += `M${r(x)} ${r(y)}L${r(x + len * Math.cos(a))} ${r(y + len * Math.sin(a))}`;
    }
  }
  return {
    stem: `M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`,
    needles,
  };
}

const SPRIGS = [
  sprig([6, 150], [110, 120], [232, 26], 30),
  sprig([6, 150], [70, 150], [176, 132], 24),
  sprig([6, 150], [40, 96], [96, 20], 24),
];

/**
 * A fir sprig with three red berries, growing from its bottom-left corner.
 * Position and mirror it with `className` (e.g. `-scale-x-100`).
 */
export function FirSprig({ className = "", size = 240 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 240 160"
      width={size}
      height={(size * 160) / 240}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
    >
      {SPRIGS.map((s, i) => (
        <g key={i}>
          <path d={s.needles} stroke={i === 0 ? "#6F9A79" : "#588567"} strokeWidth="2" />
          <path d={s.stem} stroke="#7A5B3A" strokeWidth="2.4" />
        </g>
      ))}
      {[
        [34, 138],
        [48, 150],
        [30, 154],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="7" fill="#C8473A" />
          <circle cx={cx - 2.2} cy={cy - 2.4} r="1.8" fill="#FFFFFF" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

/** Snow resting on the top edge of a card. Parent must be `relative`. */
export function SnowCap({
  className = "-top-3 left-5 right-5 h-8 w-[calc(100%-2.5rem)]",
}: {
  /** Position and size; the default suits a large rounded card. */
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute drop-shadow-[0_2px_2px_rgba(31,59,46,0.18)] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 16 C18 4 50 1 82 7 C112 0 150 2 182 8 C222 1 262 2 302 8 C332 2 372 3 400 16 L400 20 C384 30 372 23 360 21 C346 31 330 34 318 23 C300 19 280 31 262 23 C240 17 228 35 208 25 C190 19 170 29 150 23 C132 17 120 35 100 25 C84 19 60 31 44 23 C30 17 14 30 0 20 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** Soft snowdrifts along the bottom edge, blending into the next (cream) section. */
export function SnowDrift({ className = "", color = "#FBF7EC" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full sm:h-20 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 52 C160 16 300 20 470 44 C640 68 760 26 930 30 C1100 34 1250 62 1440 34 L1440 90 L0 90 Z"
        fill="#FFFFFF"
        opacity="0.35"
      />
      <path
        d="M0 66 C180 38 330 44 520 62 C700 80 860 46 1040 50 C1210 54 1330 76 1440 58 L1440 90 L0 90 Z"
        fill={color}
      />
    </svg>
  );
}
