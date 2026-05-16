import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Edelweiss Pastry Shop — Swiss Bakery in Biddeford, Maine",
  description:
    "Hand-crafted Swiss pastries, viennoiserie, breads and chocolates baked daily in Biddeford. Order online for pick-up Tuesday through Sunday.",
  metadataBase: new URL("https://edelweisspastryshop.ch"),
  openGraph: {
    title: "Edelweiss Pastry Shop",
    description:
      "A Swiss bakery in Biddeford, Maine. Croissants, breads and chocolates, baked daily.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
