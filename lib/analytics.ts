"use client";

/**
 * ANALYTICS & CONSENT
 *
 * Pequeña capa por encima de Google Analytics (gtag.js) y Meta Pixel (fbq).
 * Los scripts solo se cargan si el usuario acepta cookies de marketing/analytics
 * (ver components/CookieConsent.tsx + components/AnalyticsScripts.tsx).
 *
 * IDs configurados via env vars publicas:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export type ConsentState = "all" | "essential" | null;

const CONSENT_KEY = "edelweiss_cookie_consent";
const CONSENT_EVENT = "edelweiss-consent-change";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  return v === "all" || v === "essential" ? v : null;
}

export function setConsent(value: "all" | "essential") {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(cb: (value: ConsentState) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail as ConsentState);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

function hasMarketingConsent(): boolean {
  return getConsent() === "all";
}

/** Dispara un evento estandar de GA4 (solo si hay consentimiento). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!hasMarketingConsent()) return;
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/** Dispara un evento estandar de Meta Pixel (solo si hay consentimiento). */
export function trackMetaEvent(name: string, params?: Record<string, unknown>) {
  if (!hasMarketingConsent()) return;
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", name, params);
  }
}

interface CartLineItem {
  name: string;
  slug?: string;
  price: number;
  quantity: number;
}

/** Producto añadido al carrito. */
export function trackAddToCart(item: CartLineItem) {
  trackEvent("add_to_cart", {
    currency: "USD",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.slug,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
  trackMetaEvent("AddToCart", {
    content_name: item.name,
    content_ids: [item.slug],
    content_type: "product",
    currency: "USD",
    value: item.price * item.quantity,
  });
}

/** El cliente pasa a pagar (boton "Pay online"). */
export function trackBeginCheckout(items: CartLineItem[], total: number) {
  trackEvent("begin_checkout", {
    currency: "USD",
    value: total,
    items: items.map((i) => ({
      item_id: i.slug,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
  trackMetaEvent("InitiateCheckout", {
    currency: "USD",
    value: total,
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    content_ids: items.map((i) => i.slug),
    content_type: "product",
  });
}

/** Pago completado (pagina de confirmacion). */
export function trackPurchase(orderId: string, total: number) {
  trackEvent("purchase", {
    transaction_id: orderId,
    currency: "USD",
    value: total,
  });
  trackMetaEvent("Purchase", {
    currency: "USD",
    value: total,
  });
}
