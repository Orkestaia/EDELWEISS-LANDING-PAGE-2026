/**
 * GET /api/internal/items — Clover catalogue for the dashboard's product mapping
 * and stock snapshots. Signed access only (lib/internal-auth.ts).
 * Contract: STOCK-PLANNING-SPEC.md §4.3.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyFeedRequest } from "@/lib/internal-auth";
import { cloverCredentials, fetchCatalogue } from "@/lib/clover-sales";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const auth = verifyFeedRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { merchantId, apiToken } = cloverCredentials();
  if (!merchantId || !apiToken) return NextResponse.json({ error: "clover_not_configured" }, { status: 503 });

  try {
    const items = await fetchCatalogue(merchantId, apiToken);
    return NextResponse.json(
      { generatedAt: new Date().toISOString(), items },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[internal/items]", err);
    return NextResponse.json({ error: "clover_error", detail: String(err).slice(0, 200) }, { status: 502 });
  }
}
