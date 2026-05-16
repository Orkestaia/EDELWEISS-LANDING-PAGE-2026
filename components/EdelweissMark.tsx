type Props = {
  className?: string;
  size?: number;
  /** Monochrome version that uses currentColor for stroke. */
  mono?: boolean;
};

const N = 12;

export function EdelweissMark({ className, size = 40, mono = false }: Props) {
  if (mono) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        width={size}
        height={size}
        className={className}
        role="img"
        aria-label="Edelweiss"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {Array.from({ length: N }).map((_, i) => (
            <g key={i} transform={`rotate(${(i * 360) / N})`}>
              <path d="M 0,-90 C -10,-50 -10,-18 0,-12 C 10,-18 10,-50 0,-90 Z" />
            </g>
          ))}
          <circle cx="0" cy="0" r="13" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Edelweiss"
    >
      {/* Sage-green leaves behind, offset by half a step */}
      {Array.from({ length: N }).map((_, i) => (
        <g
          key={`leaf-${i}`}
          transform={`rotate(${(i * 360) / N + 360 / (N * 2)})`}
        >
          <path
            d="M 0,-78 C -11,-48 -11,-16 0,-10 C 11,-16 11,-48 0,-78 Z"
            fill="#7B8B6F"
            stroke="#A65A47"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Cream/ivory petals in front */}
      {Array.from({ length: N }).map((_, i) => (
        <g key={`petal-${i}`} transform={`rotate(${(i * 360) / N})`}>
          <path
            d="M 0,-92 C -10,-50 -10,-12 0,-8 C 10,-12 10,-50 0,-92 Z"
            fill="#F4ECD8"
            stroke="#A65A47"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Inner terracotta accent mark */}
          <path
            d="M 0,-66 C -2.6,-50 -2.6,-36 0,-30 C 2.6,-36 2.6,-50 0,-66 Z"
            fill="#A65A47"
          />
        </g>
      ))}

      {/* Center */}
      <circle
        cx="0"
        cy="0"
        r="13"
        fill="#E2B341"
        stroke="#3A2E20"
        strokeWidth="2.5"
      />
    </svg>
  );
}
