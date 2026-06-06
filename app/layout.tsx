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
    "Edelweiss Pastry Shop — a Swiss-inspired bakery on Alfred Street in downtown Biddeford, Maine. Hand-laminated croissants, slow-fermented breads, Swiss pastries and small-batch chocolates, baked daily. Order online for in-store pick-up Tuesday through Sunday.",
  keywords: [
    // Local SEO (Biddeford-first)
    "bakery Biddeford",
    "Biddeford pastry shop",
    "Biddeford croissants",
    "best bakery Biddeford Maine",
    "pastries Biddeford",
    "chocolate shop Biddeford",
    "Alfred Street Biddeford bakery",
    // City-cluster SEO (Southern Maine)
    "bakery Saco Maine",
    "bakery Old Orchard Beach",
    "Kennebunk bakery",
    "Portland Maine Swiss bakery",
    // Brand & category
    "Swiss bakery Maine",
    "Swiss-inspired bakery",
    "hand-laminated croissants Maine",
    "artisan bakery Maine",
    "Edelweiss bakery",
    "Edelweiss Pastry Shop",
    "Edelweiss Confections",
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
      "Hand-laminated croissants, century-old pastries and small-batch chocolates — baked daily at 5 Alfred Street, Biddeford, Maine.",
    siteName: "Edelweiss Pastry Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edelweiss Pastry Shop · Biddeford, Maine",
    description:
      "Swiss-inspired bakery in downtown Biddeford. Order online for in-store pick-up.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Schema.org LocalBusiness / Bakery — strong signal for Google local SEO.
// This appears in the page <head> and helps Google understand WHO we are,
// WHERE the bakery is, WHEN it opens, and HOW to reach us.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Edelweiss Pastry Shop",
  alternateName: "Edelweiss Confections",
  image: "https://edelweisspastryshop.ch/images/edelweiss-sign.png",
  url: "https://edelweisspastryshop.ch",
  telephone: "+1-207-770-6945",
  email: "info@edelweissconfections.com",
  priceRange: "$$",
  servesCuisine: ["Swiss", "European", "Bakery", "Pastry", "Chocolate"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "5 Alfred Street #103",
    addressLocality: "Biddeford",
    addressRegion: "ME",
    postalCode: "04005",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "14:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "14:00",
    },
  ],
  sameAs: ["https://www.instagram.com/edelweissmaine"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
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
