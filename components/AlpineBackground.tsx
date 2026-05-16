type Props = {
  className?: string;
  tone?: "forest" | "cream" | "rust";
};

export function AlpineSilhouette({ className, tone = "forest" }: Props) {
  const fills =
    tone === "forest"
      ? { back: "#AEBAA0", mid: "#86987C", front: "#5E6F52" }
      : tone === "rust"
      ? { back: "#EFCFC1", mid: "#DDA48C", front: "#B85C3E" }
      : { back: "#F7F1E0", mid: "#EFE6CC", front: "#E5D7B0" };

  return (
    <svg
      className={className}
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill={fills.back}
        fillOpacity="0.55"
        d="M0 220 L120 150 L220 200 L340 110 L460 180 L600 90 L740 170 L880 110 L1020 200 L1180 130 L1320 190 L1440 150 L1440 320 L0 320 Z"
      />
      <path
        fill={fills.mid}
        fillOpacity="0.75"
        d="M0 260 L100 210 L200 250 L320 180 L440 240 L560 170 L700 230 L820 180 L960 250 L1100 200 L1240 240 L1360 210 L1440 230 L1440 320 L0 320 Z"
      />
      <path
        fill={fills.front}
        d="M0 290 L120 260 L240 290 L360 250 L480 290 L600 260 L720 290 L840 260 L960 290 L1080 270 L1200 290 L1320 270 L1440 290 L1440 320 L0 320 Z"
      />
    </svg>
  );
}

export function AlpinePeaks({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M40 320 L150 180 L210 250 L290 130 L370 260 L470 160 L560 320 Z" />
        <path d="M150 180 L180 210 M290 130 L320 175 M470 160 L500 200" />
        <path d="M60 320 L560 320" strokeDasharray="3 6" />
      </g>
    </svg>
  );
}
