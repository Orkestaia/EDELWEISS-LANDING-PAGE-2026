type Props = {
  className?: string;
  size?: number;
  strokeOnly?: boolean;
};

export function EdelweissMark({
  className,
  size = 36,
  strokeOnly = false,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Edelweiss"
    >
      <g
        fill={strokeOnly ? "none" : "currentColor"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <g key={i} transform={`rotate(${angle} 32 32)`}>
              <path d="M32 8 C 28 18, 28 26, 32 31 C 36 26, 36 18, 32 8 Z" />
            </g>
          );
        })}
        <circle cx="32" cy="32" r="4" />
      </g>
    </svg>
  );
}
