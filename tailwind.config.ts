import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF7EC",
          100: "#F7F1E0",
          200: "#EFE6CC",
          300: "#E5D7B0",
          DEFAULT: "#F4ECD8",
        },
        forest: {
          50: "#EEF1EA",
          100: "#D6DDCC",
          200: "#AEBAA0",
          300: "#86987C",
          400: "#6E7E5E",
          500: "#5E6F52",
          600: "#4A5841",
          700: "#3A4534",
          800: "#2C3528",
          DEFAULT: "#5E6F52",
        },
        rust: {
          50: "#F8EAE4",
          100: "#EFCFC1",
          200: "#DDA48C",
          300: "#CB7C5F",
          400: "#B85C3E",
          500: "#A14B30",
          DEFAULT: "#B85C3E",
        },
        mustard: {
          50: "#FBF1D6",
          100: "#F4DFA1",
          200: "#EBC76B",
          300: "#E2B341",
          DEFAULT: "#E2B341",
        },
        cocoa: {
          50: "#F1E7DC",
          100: "#D9C3AA",
          200: "#A98561",
          300: "#7A5A3D",
          400: "#523B28",
          500: "#3A2E20",
          DEFAULT: "#3A2E20",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        widest: "0.22em",
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(58, 46, 32, 0.25)",
        card: "0 30px 60px -40px rgba(58, 46, 32, 0.45)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.23 0 0 0 0 0.18 0 0 0 0 0.13 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translate3d(0, 0, 0)" },
          "100%": { transform: "scale(1.16) translate3d(-1.5%, -1%, 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        kenburns: "kenburns 22s ease-in-out infinite alternate",
        marquee: "marquee 50s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
