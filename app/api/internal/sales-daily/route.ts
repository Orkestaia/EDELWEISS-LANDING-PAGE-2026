/**
 * GET /api/internal/sales-daily?date=YYYY-MM-DD — units sold per Clover item on
 * one Maine day (counter + online), hourly curve, first/last sale, stock at
 * snapshot time. Signed access only. Contract: STOCK-PLANNING-SPEC.md §4.2.
 *
 * Semantics (agreed with the dashboard, 2026-10-29):
 *  - Every visible catalogue item is returned, with zeros when it did not
 *    sell. A missing item means it is not in Clover, never "no data".
 *  - `complete` is true once the Maine day is over; today returns false and
 *    may be re-read as often as needed.
 *  - Refunds done later flip `refunded` on the line item, so re-reading a
 *    past day returns the corrected figures (`refundedUnits` shows them).
 *  - Dates older than Clover's 90-day order window return 422.
 *  - `stockEnd` is the Clover stock count at the moment of this call, not at
 *    closing time. Snapshot at 02:30 for yesterday = overnight count.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyFeedRequest } from "@/lib/internal-auth";
import { cloverCredentials, fetchDailySales, isValidDate, maineDate } from "@/lib/clover-sales";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const WINDOW_DAYS = 90;

export async function GET(request: NextRequest) {
  const auth = verifyFeedRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const date = request.nextUrl.searchParams.get("date") || "";
  if (!isValidDate(date)) return NextResponse.json({ error: "bad_date", hint: "date=YYYY-MM-DD" }, { status: 400 });
  const today = maineDate(Date.now());
  if (date > today) return NextResponse.json({ error: "future_date" }, { status: 400 });
  const oldest = maineDate(Date.now() - WINDOW_DAYS * 86400_000);
  if (date < oldest) {
    return NextResponse.json({ error: "outside_clover_window", oldestAvailable: oldest }, { status: 422 });
  }

  const { merchantId, apiToken } = cloverCredentials();
  if (!merchantId || !apiToken) return NextResponse.json({ error: "clover_not_configured" }, { status: 503 });

  try {
    const data = await fetchDailySales(merchantId, apiToken, date);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[internal/sales-daily]", err);
    return NextResponse.json({ error: "clover_error", detail: String(err).slice(0, 200) }, { status: 502 });
  }
}
