/**
 * NEWSLETTER SUBSCRIBE
 *
 * POST /api/subscribe
 * Body: { firstName, email, birthdayMonth, birthdayDay }
 *
 * Creates/updates a Brevo contact with FIRSTNAME + BIRTHDAY and adds it to the
 * signup list. Brevo automations handle the rest:
 *   - "Welcome" automation (list-entry trigger) → seasonal recipe email
 *   - "Birthday" automation (anniversary trigger on BIRTHDAY) → discount email
 *
 * BIRTHDAY is stored as YYYY-MM-DD using a fixed year (2000, a leap year so
 * Feb 29 is valid). Brevo's anniversary trigger repeats yearly on month/day
 * and ignores the year, so we don't need to ask the visitor for it.
 *
 * SECURITY: BREVO_API_KEY never leaves this server. Configure it, plus
 * BREVO_LIST_ID, in .env.local and in Vercel project env vars.
 */

import { NextRequest, NextResponse } from "next/server";

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    console.error("[Subscribe] BREVO_API_KEY or BREVO_LIST_ID not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const firstName = (body.firstName || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const month = parseInt(body.birthdayMonth || "", 10);
  const day = parseInt(body.birthdayDay || "", 10);

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (!firstName) {
    return NextResponse.json({ error: "Please enter your first name" }, { status: 400 });
  }
  // Validate birthday (month/day only)
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (
    !month || month < 1 || month > 12 ||
    !day || day < 1 || day > daysInMonth[month - 1]
  ) {
    return NextResponse.json({ error: "Please choose a valid birthday" }, { status: 400 });
  }

  const birthday = `2000-${pad(month)}-${pad(day)}`;

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        // This account uses NOMBRE (not FIRSTNAME) as its name attribute, so
        // web signups share the same field as every other contact. BIRTHDAY is
        // a date attribute (2000-MM-DD) that feeds Brevo's anniversary automation.
        attributes: { NOMBRE: firstName, BIRTHDAY: birthday },
        listIds: [Number(listId)],
        updateEnabled: true, // upsert: existing contacts are updated, not rejected
      }),
    });

    // 201 = created, 204 = updated (updateEnabled). Both are success.
    if (res.status === 201 || res.status === 204) {
      return NextResponse.json({ ok: true });
    }

    const errText = await res.text();
    console.error("[Subscribe] Brevo error:", res.status, errText);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 502 });
  } catch (err) {
    console.error("[Subscribe] unexpected error:", err);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 502 });
  }
}
