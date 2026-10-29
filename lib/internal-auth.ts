/**
 * Signed server-to-server access for the marketing dashboard (read-only feed).
 *
 * Header:  x-edelweiss-signature: t=<unix seconds>,v1=<hex hmac>
 * Signed:  HMAC_SHA256(DASHBOARD_FEED_SECRET, `${t}.${METHOD} ${PATH_WITH_QUERY}.${RAW_BODY}`)
 *          RAW_BODY is "" for GET. Requests older/newer than 300 s are rejected.
 *
 * Contract: EDELWEISS-MARKETING_DASHBOARD/docs/STOCK-PLANNING-SPEC.md, section 4.1.
 * The Clover tokens never leave this project; the dashboard only ever sees
 * what these endpoints return.
 */

import crypto from "crypto";
import type { NextRequest } from "next/server";

export const SIGNATURE_HEADER = "x-edelweiss-signature";
const MAX_SKEW_SECONDS = 300;

export function feedConfigured(): boolean {
  return !!process.env.DASHBOARD_FEED_SECRET;
}

export function signFeedRequest(
  secret: string,
  method: string,
  pathWithQuery: string,
  rawBody = "",
  tSeconds = Math.floor(Date.now() / 1000)
): string {
  const mac = crypto
    .createHmac("sha256", secret)
    .update(`${tSeconds}.${method.toUpperCase()} ${pathWithQuery}.${rawBody}`, "utf8")
    .digest("hex");
  return `t=${tSeconds},v1=${mac}`;
}

export type FeedAuth = { ok: true } | { ok: false; status: number; error: string };

export function verifyFeedRequest(request: NextRequest, rawBody = ""): FeedAuth {
  const secret = process.env.DASHBOARD_FEED_SECRET;
  if (!secret) return { ok: false, status: 503, error: "feed_not_configured" };

  const header = request.headers.get(SIGNATURE_HEADER) || "";
  const parts: Record<string, string> = {};
  for (const piece of header.split(",")) {
    const i = piece.indexOf("=");
    if (i > 0) parts[piece.slice(0, i).trim()] = piece.slice(i + 1).trim();
  }
  const t = Number(parts["t"]);
  const v1 = parts["v1"] || "";
  if (!Number.isFinite(t) || !/^[0-9a-f]{64}$/i.test(v1)) {
    return { ok: false, status: 401, error: "bad_signature_header" };
  }
  if (Math.abs(Date.now() / 1000 - t) > MAX_SKEW_SECONDS) {
    return { ok: false, status: 401, error: "stale_timestamp" };
  }

  const pathWithQuery = request.nextUrl.pathname + request.nextUrl.search;
  const expected = signFeedRequest(secret, request.method, pathWithQuery, rawBody, t).split("v1=")[1];
  try {
    const ok = crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
    return ok ? { ok: true } : { ok: false, status: 401, error: "invalid_signature" };
  } catch {
    return { ok: false, status: 401, error: "invalid_signature" };
  }
}
