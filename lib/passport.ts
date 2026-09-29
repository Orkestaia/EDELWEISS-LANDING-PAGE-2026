/**
 * SWISS PASSPORT REWARDS — server-only client for the marketing dashboard.
 *
 * The dashboard (EDELWEISS-MARKETING_DASHBOARD) is the source of truth for
 * stamps and 15% reward codes. This site only:
 *   - validates a code at checkout (code + the customer's email), and
 *   - marks it redeemed from the Clover webhook once the payment is APPROVED.
 *
 * Never import this from a client component: it reads PASSPORT_REDEEM_SECRET.
 */

const API_BASE = (
  process.env.PASSPORT_API_BASE_URL || "https://edelweiss-marketing-dashboard.vercel.app"
).replace(/\/$/, "");

export type RewardCheck =
  | { valid: true; percent: number; duplicate?: boolean }
  | { valid: false; reason: string };

export function normalizeRewardCode(code: unknown): string {
  return String(code ?? "").trim().toUpperCase();
}

const CODE_RE = /^SWISS-[A-Z0-9]{6}$/;

/** Customer-facing message for each reason the dashboard can return. */
export function rewardErrorMessage(reason: string): string {
  switch (reason) {
    case "not_found":
      return "We couldn't find that code. Please check it and try again.";
    case "email_mismatch":
      return "This code belongs to a different email. Use the same email as your Swiss Passport.";
    case "expired":
      return "This reward code has expired.";
    case "redeemed":
      return "This reward code has already been used.";
    case "revoked":
      return "This reward code is no longer valid.";
    default:
      return "We couldn't check your code right now. Please try again in a minute.";
  }
}

/**
 * Without `orderId` it only checks the code; with `orderId` it redeems it
 * (idempotent for the same order).
 */
export async function checkReward(
  rawCode: string,
  email: string,
  orderId?: string
): Promise<RewardCheck> {
  const code = normalizeRewardCode(rawCode);
  if (!CODE_RE.test(code)) return { valid: false, reason: "not_found" };

  const secret = process.env.PASSPORT_REDEEM_SECRET;
  if (!secret) {
    console.error("[Passport] PASSPORT_REDEEM_SECRET is not configured");
    return { valid: false, reason: "unavailable" };
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/passport/rewards/${orderId ? "redeem" : "validate"}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderId ? { code, email, orderId } : { code, email }),
        cache: "no-store",
        // A cold dashboard (Vercel cold start + Postgres connect) took ~6s in testing.
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!res.ok) {
      console.error(`[Passport] reward ${orderId ? "redeem" : "validate"} HTTP ${res.status}`);
      return { valid: false, reason: "unavailable" };
    }
    const data = await res.json();
    if (data?.valid === true && typeof data.percent === "number") {
      return { valid: true, percent: data.percent, duplicate: data.duplicate };
    }
    return { valid: false, reason: typeof data?.reason === "string" ? data.reason : "unavailable" };
  } catch (err) {
    console.error("[Passport] reward request failed:", err);
    return { valid: false, reason: "unavailable" };
  }
}
