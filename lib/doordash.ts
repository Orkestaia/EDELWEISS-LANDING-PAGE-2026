/**
 * DOORDASH DRIVE — server-only client for white-label deliveries.
 *
 * DoorDash supplies the courier; the order and the payment stay in Clover.
 * Auth is a short-lived JWT signed with the credential from the Developer
 * Portal (env DOORDASH_DEVELOPER_ID / DOORDASH_KEY_ID / DOORDASH_SIGNING_SECRET).
 * The same endpoints serve sandbox and production: the credential decides.
 * Sandbox deliveries are never dispatched to a real Dasher.
 *
 * Flow used by the site:
 *   checkout  → createQuote()    price + ETA for the address, nothing booked
 *   webhook   → createDelivery() once Clover reports the payment APPROVED
 *               (external id = Clover order id, so a retried webhook can't
 *               book two couriers: DoorDash answers duplicate_delivery_id)
 *
 * Docs: https://developer.doordash.com/en-US/api/drive
 */

import crypto from "crypto";
import { DELIVERY_PREP_MINUTES } from "./delivery";

const BASE_URL = "https://openapi.doordash.com/drive/v2";
const TIMEOUT_MS = 8000;

/**
 * production: real couriers (needs production credentials from DoorDash).
 * sandbox:    API calls against the simulator; nothing is dispatched.
 * manual:     quote for price/coverage only; the webhook does NOT book and the
 *             staff requests the courier in the DoorDash Merchant Portal
 *             ("Request a delivery"). Launch mode until the API is approved.
 */
export const DOORDASH_ENV: "sandbox" | "production" | "manual" =
  process.env.DOORDASH_ENV === "production"
    ? "production"
    : process.env.DOORDASH_ENV === "manual"
    ? "manual"
    : "sandbox";

/** The bakery, as DoorDash needs it. */
export const PICKUP = {
  address: "5 Alfred St Ste 103, Biddeford, ME 04005",
  businessName: "Edelweiss Pastry Shop",
  phone: "+12077706945",
  instructions:
    "Online delivery order. Ask at the counter for the order under the customer's name.",
} as const;

export function doordashConfigured(): boolean {
  return !!(
    process.env.DOORDASH_DEVELOPER_ID &&
    process.env.DOORDASH_KEY_ID &&
    process.env.DOORDASH_SIGNING_SECRET
  );
}

export class DoorDashError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors: { field: string; error: string }[] = []
  ) {
    super(message);
    this.name = "DoorDashError";
  }
}

export interface DeliveryRequest {
  /** Our id for the delivery. Clover order id on real deliveries. */
  externalId: string;
  dropoffAddress: string;
  dropoffName: string;
  dropoffPhone: string;
  dropoffInstructions?: string;
  /** Items value in cents (no tax, no fee). Used for DoorDash's own records. */
  orderValueCents: number;
  items?: { name: string; quantity: number }[];
  /** When the courier should collect. Defaults to now + prep time. */
  pickupTime?: Date;
  tipCents?: number;
}

export interface DeliveryResult {
  externalId: string;
  status: string;
  feeCents: number;
  trackingUrl: string | null;
  pickupEta: string | null;
  dropoffEta: string | null;
  dropoffAddress: string;
  raw: Record<string, unknown>;
}

const b64url = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString("base64url");

function signJwt(): string {
  const developerId = process.env.DOORDASH_DEVELOPER_ID!;
  const keyId = process.env.DOORDASH_KEY_ID!;
  const secret = process.env.DOORDASH_SIGNING_SECRET!;
  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    b64url({ alg: "HS256", typ: "JWT", "dd-ver": "DD-JWT-V1" }) +
    "." +
    b64url({ aud: "doordash", iss: developerId, kid: keyId, exp: now + 300, iat: now });
  const signature = crypto
    .createHmac("sha256", Buffer.from(secret, "base64url"))
    .update(unsigned)
    .digest("base64url");
  return `${unsigned}.${signature}`;
}

async function call<T = Record<string, unknown>>(
  method: "GET" | "POST",
  path: string,
  body?: unknown
): Promise<T> {
  if (!doordashConfigured()) {
    throw new DoorDashError(503, "not_configured", "DoorDash credentials are not configured");
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${signJwt()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    throw new DoorDashError(
      res.status,
      data.code || `http_${res.status}`,
      data.message || `DoorDash ${method} ${path} failed (${res.status})`,
      data.field_errors || []
    );
  }
  return data as T;
}

/** US phone → E.164, which DoorDash requires. "207 555 0123" → "+12075550123". */
export function toE164(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

function splitName(full: string): { given: string; family: string } {
  const parts = full.trim().split(/\s+/);
  return { given: parts[0] || "Customer", family: parts.slice(1).join(" ") || "" };
}

function toBody(req: DeliveryRequest) {
  const { given, family } = splitName(req.dropoffName);
  const pickupTime = req.pickupTime ?? new Date(Date.now() + DELIVERY_PREP_MINUTES * 60_000);
  return {
    external_delivery_id: req.externalId,
    pickup_address: PICKUP.address,
    pickup_business_name: PICKUP.businessName,
    pickup_phone_number: PICKUP.phone,
    pickup_instructions: PICKUP.instructions,
    pickup_time: pickupTime.toISOString(),
    dropoff_address: req.dropoffAddress,
    dropoff_phone_number: toE164(req.dropoffPhone),
    dropoff_contact_given_name: given,
    dropoff_contact_family_name: family,
    ...(req.dropoffInstructions ? { dropoff_instructions: req.dropoffInstructions.slice(0, 250) } : {}),
    order_value: req.orderValueCents,
    ...(req.items?.length ? { items: req.items.map((i) => ({ name: i.name, quantity: i.quantity })) } : {}),
    ...(req.tipCents ? { tip: req.tipCents } : {}),
    contactless_dropoff: false,
    action_if_undeliverable: "return_to_pickup",
  };
}

function toResult(d: any): DeliveryResult {
  return {
    externalId: d.external_delivery_id,
    status: d.delivery_status || "unknown",
    feeCents: typeof d.fee === "number" ? d.fee : 0,
    trackingUrl: d.tracking_url || null,
    pickupEta: d.pickup_time_estimated || null,
    dropoffEta: d.dropoff_time_estimated || null,
    dropoffAddress: d.dropoff_address || "",
    raw: d,
  };
}

/** Price + ETA for an address. Books nothing. Quote ids expire after 5 minutes. */
export async function createQuote(req: DeliveryRequest): Promise<DeliveryResult> {
  return toResult(await call("POST", "/quotes", toBody(req)));
}

/** Books the courier (quote + accept in one call). Idempotent on externalId. */
export async function createDelivery(req: DeliveryRequest): Promise<DeliveryResult> {
  return toResult(await call("POST", "/deliveries", toBody(req)));
}

export async function getDelivery(externalId: string): Promise<DeliveryResult> {
  return toResult(await call("GET", `/deliveries/${encodeURIComponent(externalId)}`));
}

/** Cancels before a Dasher is assigned. */
export async function cancelDelivery(externalId: string): Promise<DeliveryResult> {
  return toResult(await call("PUT" as any, `/deliveries/${encodeURIComponent(externalId)}/cancel`));
}

/** Customer-facing wording for a failed quote/booking. */
export function friendlyDoorDashError(err: unknown): string {
  if (!(err instanceof DoorDashError)) {
    return "Delivery is temporarily unavailable. Please try again or choose pick-up.";
  }
  const msg = `${err.message} ${err.fieldErrors.map((f) => f.error).join(" ")}`.toLowerCase();
  if (msg.includes("radius") || msg.includes("outside") || msg.includes("too far") || msg.includes("not deliverable")) {
    return "Sorry, that address is outside our delivery area. You can still reserve a pick-up.";
  }
  if (err.fieldErrors.some((f) => f.field.includes("dropoff_address")) || msg.includes("address")) {
    return "We couldn't find that address. Please check the street, city and ZIP code.";
  }
  if (err.fieldErrors.some((f) => f.field.includes("phone")) || msg.includes("phone")) {
    return "Please enter a valid US phone number so the driver can reach you.";
  }
  if (msg.includes("pickup_time") || msg.includes("too soon") || msg.includes("in the past")) {
    return "Delivery isn't available at this time. Please try again in a few minutes or choose pick-up.";
  }
  if (err.code === "not_configured") {
    return "Delivery isn't set up yet. Please choose pick-up.";
  }
  return "Delivery is temporarily unavailable. Please try again or choose pick-up.";
}

/** "2026-10-17T19:33:02Z" → "3:33 PM" in Maine. */
export function formatEtaMaine(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}
