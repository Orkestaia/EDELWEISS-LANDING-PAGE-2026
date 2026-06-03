import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { CartButton } from "@/components/CartButton";

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
  title: {
    default:
      "Edelweiss Pastry Shop · Swiss-inspired Bakery in Biddeford, Maine",
    template: "%s · Edelweiss Pastry Shop",
  },
  description:
    "Swiss-inspired bakery in Biddeford, Maine. Hand-laminated croissants, slow-fermented breads, Swiss pastries and small-batch chocolates — baked daily, ordered online for pick-up Tuesday through Sunday.",
  keywords: [
    "Swiss bakery Maine",
    "Swiss-inspired bakery",
    "bakery Biddeford",
    "Biddeford pastry shop",
    "Swiss pastries Maine",
    "croissants Biddeford",
    "Swiss chocolates Maine",
    "Edelweiss bakery",
    "artisan bakery Maine",
  ],
  applicationName: "Edelweiss Pastry Shop",
  authors: [{ name: "Edelweiss Confections LLC" }],
  creator: "Edelweiss Confections LLC",
  metadataBase: new URL("https://edelweisspastryshop.ch"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Edelweiss Pastry Shop · Swiss-inspired Bakery in Biddeford, Maine",
    description:
      "Hand-laminated croissants, slow-fermented Swiss breads, century-old pastries and small-batch chocolates — baked daily in Biddeford, Maine.",
    siteName: "Edelweiss Pastry Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edelweiss Pastry Shop",
    description:
      "Swiss-inspired bakery in Biddeford, Maine. Order online for in-store pick-up.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <CartButton />
        </CartProvider>
      </body>
    </html>
  );
}
