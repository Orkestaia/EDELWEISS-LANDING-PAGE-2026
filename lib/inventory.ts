"use client";

import { useEffect, useState } from "react";

export type StockMap = Record<string, number | null>;

/** Threshold below which we show "Only X left" urgency badge. */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Client hook: fetches current stock per product from /api/clover/inventory.
 * Polls every 60s so the page reflects POS sales without a full reload.
 *
 * Returns:
 *   - `stocks`: object mapping slug → stockCount (number) or null (no tracking)
 *   - `loaded`: true once the first response has arrived
 *
 * IMPORTANT: a slug missing from the map (or null) means "no tracking" — treat
 * as always available. Never show "sold out" for null values.
 */
export function useInventory(): { stocks: StockMap; loaded: boolean } {
  const [stocks, setStocks] = useState<StockMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStocks = async () => {
      try {
        const r = await fetch("/api/clover/inventory", { cache: "no-store" });
        if (!r.ok) return;
        const data = await r.json();
        if (cancelled) return;
        setStocks(data.stocks || {});
        setLoaded(true);
      } catch {
        /* silent: if the API fails we fall back to "available" everywhere */
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { stocks, loaded };
}

/** Returns "available" | "low" | "sold-out" | "untracked" for a product. */
export function stockState(stockCount: number | null | undefined):
  | "available"
  | "low"
  | "sold-out"
  | "untracked" {
  if (stockCount == null) return "untracked";
  if (stockCount <= 0) return "sold-out";
  if (stockCount < LOW_STOCK_THRESHOLD) return "low";
  return "available";
}
