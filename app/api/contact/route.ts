import { NextRequest, NextResponse } from "next/server";

const WEBHOOKS = {
  special: "https://acgrowthmarketing.app.n8n.cloud/webhook/6ae1e8b5-fea5-43a7-bf9d-2942f2d05690",
  wholesale: "https://acgrowthmarketing.app.n8n.cloud/webhook/c2b0c0d9-9630-4a26-94b3-a7b7fc7b4948",
};

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, ...fields } = body;
  if (type !== "special" && type !== "wholesale") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const required =
    type === "special"
      ? ["name", "email", "message"]
      : ["businessName", "contactName", "email", "message"];

  for (const field of required) {
    if (!fields[field]?.trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  try {
    const res = await fetch(WEBHOOKS[type], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      console.error(`n8n webhook error: ${res.status}`);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact webhook error:", err);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
