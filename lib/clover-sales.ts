/**
 * Read-only Clover sales + catalogue, aggregated per Maine day, for the
 * marketing dashboard's production planner (STOCK-PLANNING-SPEC.md §4).
 *
 * Facts about Clover that shape this file:
 *  - The orders list only returns the last ~90 days (older orders exist but
 *    must be read one by one; the dashboard stores its own daily snapshots).
 *  - unitQty is stored ×1000 (weighed items can be fractional).
 *  - A sale is an order with at least one payment `result: "SUCCESS"`.
 *    Refunds flip `refunded: true` on the line item (full or partial refunds
 *    done from the POS), so re-reading a day later reflects them.
 *  - Our website orders have a line-item note starting with "ONLINE".
 */

const isSandbox = process.env.NEXT_PUBLIC_ENV === "sandbox";
export const CLOVER_API_URL = isSandbox ? "https://apisandbox.dev.clover.com" : "https://api.clover.com";
const TZ = "America/New_York";

export function cloverCredentials() {
  return {
    merchantId: isSandbox ? process.env.CLOVER_SANDBOX_MERCHANT_ID : process.env.CLOVER_MERCHANT_ID,
    apiToken: isSandbox ? process.env.CLOVER_SANDBOX_API_TOKEN : process.env.CLOVER_API_TOKEN,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with retry on 429/5xx/network, like the webhook does. */
export async function cloverGet<T = any>(path: string, apiToken: string, label: string): Promise<T> {
  const delays = [0, 600, 1800, 3500];
  let last = "";
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await sleep(delays[i]);
    try {
      const res = await fetch(`${CLOVER_API_URL}${path}`, {
        headers: { Authorization: `Bearer ${apiToken}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (res.status === 429 || res.status >= 500) {
        last = `HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) throw new Error(`[Clover] ${label}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("[Clover]")) throw err;
      last = String(err);
    }
  }
  throw new Error(`[Clover] ${label}: failed after retries (${last})`);
}

// ---------- Maine dates ----------

const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false });

export function maineDate(ms: number): string {
  return dateFmt.format(new Date(ms));
}
export function maineHHMM(ms: number): string {
  return timeFmt.format(new Date(ms));
}
export function maineHour(ms: number): number {
  return Number(maineHHMM(ms).slice(0, 2));
}

/** UTC millisecond range [start, end) covering one Maine calendar day (DST-safe). */
export function maineDayRange(date: string): { start: number; end: number } {
  const startOf = (d: string) => {
    // First guess: local midnight = UTC midnight + 5h; then correct by what Maine actually reads.
    let guess = Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10), 5);
    for (let i = 0; i < 3; i++) {
      const read = maineDate(guess);
      const hhmm = maineHHMM(guess);
      if (read === d && hhmm === "00:00") return guess;
      const [h, m] = hhmm.split(":").map(Number);
      const delta = read < d ? 24 * 60 - (h * 60 + m) : read > d ? -(h * 60 + m) - 24 * 60 : -(h * 60 + m);
      guess += delta * 60_000;
    }
    return guess;
  };
  const start = startOf(date);
  const next = new Date(start + 36 * 3600_000);
  return { start, end: startOf(maineDate(next.getTime())) };
}

export function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(`${s}T12:00:00Z`));
}

// ---------- Catalogue ----------

export interface CatalogueItem {
  cloverItemId: string;
  name: string;
  priceCents: number;
  category: string | null;
  tracked: boolean;
  stock: number | null;
  hidden: boolean;
  available: boolean;
}

export async function fetchCatalogue(merchantId: string, apiToken: string): Promise<CatalogueItem[]> {
  const out: CatalogueItem[] = [];
  for (let offset = 0; offset < 5000; offset += 1000) {
    const data = await cloverGet<{ elements: any[] }>(
      `/v3/merchants/${merchantId}/items?limit=1000&offset=${offset}&expand=categories,itemStock`,
      apiToken,
      "items"
    );
    for (const it of data.elements || []) {
      const stock = it.itemStock;
      const count =
        typeof stock?.stockCount === "number" ? stock.stockCount : typeof stock?.quantity === "number" ? Math.floor(stock.quantity) : null;
      out.push({
        cloverItemId: it.id,
        name: it.name,
        priceCents: it.price ?? 0,
        category: it.categories?.elements?.[0]?.name ?? null,
        tracked: count !== null,
        stock: count,
        hidden: !!it.hidden,
        available: it.available !== false,
      });
    }
    if ((data.elements || []).length < 1000) break;
  }
  return out;
}

// ---------- Daily sales ----------

export interface DailyItem {
  cloverItemId: string | null;
  name: string;
  unitsInStore: number;
  unitsOnline: number;
  unitsTotal: number;
  refundedUnits: number;
  revenueCents: number;
  firstSaleAt: string | null;
  lastSaleAt: string | null;
  hourly: Record<string, number>;
  stockEnd: number | null;
}

export interface DailySales {
  date: string;
  timezone: string;
  generatedAt: string;
  complete: boolean;
  orders: number;
  paidOrders: number;
  items: DailyItem[];
}

const EXCLUDED_LINE_NAMES = new Set(["Delivery (DoorDash)", "Driver tip (DoorDash)"]);

export async function fetchDailySales(merchantId: string, apiToken: string, date: string): Promise<DailySales> {
  const { start, end } = maineDayRange(date);
  const orders: any[] = [];
  for (let offset = 0; offset < 10000; offset += 1000) {
    const data = await cloverGet<{ elements: any[] }>(
      `/v3/merchants/${merchantId}/orders?filter=createdTime>=${start}&filter=createdTime<${end}` +
        `&expand=lineItems,payments&limit=1000&offset=${offset}`,
      apiToken,
      `orders ${date}`
    );
    orders.push(...(data.elements || []));
    if ((data.elements || []).length < 1000) break;
  }

  // Catalogue: every tracked/visible item appears even with zero sales, so
  // "0" and "no data" are never confused; it also gives the stock at snapshot time.
  const catalogue = await fetchCatalogue(merchantId, apiToken);
  const byId = new Map<string, DailyItem>();
  const byName = new Map<string, DailyItem>();
  const blank = (id: string | null, name: string, stock: number | null): DailyItem => ({
    cloverItemId: id,
    name,
    unitsInStore: 0,
    unitsOnline: 0,
    unitsTotal: 0,
    refundedUnits: 0,
    revenueCents: 0,
    firstSaleAt: null,
    lastSaleAt: null,
    hourly: {},
    stockEnd: stock,
  });
  for (const c of catalogue) {
    if (c.hidden) continue;
    const row = blank(c.cloverItemId, c.name, c.stock);
    byId.set(c.cloverItemId, row);
    if (!byName.has(c.name)) byName.set(c.name, row);
  }

  let paidOrders = 0;
  for (const o of orders) {
    const paid = (o.payments?.elements || []).some((p: any) => p.result === "SUCCESS");
    if (!paid) continue;
    paidOrders++;
    const lines: any[] = o.lineItems?.elements || [];
    const online = lines.some((li) => typeof li.note === "string" && li.note.startsWith("ONLINE"));
    for (const li of lines) {
      if (EXCLUDED_LINE_NAMES.has(li.name)) continue;
      const rawQty = typeof li.unitQty === "number" ? li.unitQty : 1000;
      const qty = Math.round((rawQty >= 1000 || rawQty === 0 ? rawQty / 1000 : rawQty) * 100) / 100;
      const id: string | undefined = li.item?.id;
      let row = (id && byId.get(id)) || byName.get(li.name);
      if (!row) {
        row = blank(id ?? null, li.name, null);
        if (id) byId.set(id, row);
        byName.set(li.name, row);
      }
      if (li.refunded) {
        row.refundedUnits = round2(row.refundedUnits + qty);
        continue;
      }
      const ms: number = li.createdTime || o.createdTime;
      const hhmm = maineHHMM(ms);
      if (online) row.unitsOnline = round2(row.unitsOnline + qty);
      else row.unitsInStore = round2(row.unitsInStore + qty);
      row.unitsTotal = round2(row.unitsInStore + row.unitsOnline);
      row.revenueCents += Math.round((li.price || 0) * qty);
      const h = String(maineHour(ms));
      row.hourly[h] = round2((row.hourly[h] || 0) + qty);
      if (!row.firstSaleAt || hhmm < row.firstSaleAt) row.firstSaleAt = hhmm;
      if (!row.lastSaleAt || hhmm > row.lastSaleAt) row.lastSaleAt = hhmm;
    }
  }

  const today = maineDate(Date.now());
  const items = [...new Set([...byId.values(), ...byName.values()])].sort((a, b) => a.name.localeCompare(b.name));
  return {
    date,
    timezone: TZ,
    generatedAt: new Date().toISOString(),
    complete: date < today,
    orders: orders.length,
    paidOrders,
    items,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
