/**
 * POST /api/passport/validate   { code, email }
 *
 * Checkout's "Apply" button. Only checks the Swiss Passport reward code — it is
 * redeemed later by the Clover webhook, once the payment is approved.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkReward, normalizeRewardCode, rewardErrorMessage } from "@/lib/passport";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { valid: false, error: "Enter your email above first — it must match your Swiss Passport." },
      { status: 400 }
    );
  }

  const code = normalizeRewardCode(body?.code);
  const result = await checkReward(code, email);
  if (!result.valid) {
    return NextResponse.json({ valid: false, error: rewardErrorMessage(result.reason) });
  }
  return NextResponse.json({ valid: true, code, percent: result.percent });
}
