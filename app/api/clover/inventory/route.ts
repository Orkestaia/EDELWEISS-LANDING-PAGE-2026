/**
 * CLOVER INVENTORY API
 *
 * GET /api/clover/inventory
 * Devuelve el stock actual de cada producto del catálogo de la web.
 *
 * Respuesta:
 * {
 *   stocks: { [slug]: number | null },
 *   updatedAt: string
 * }
 * - number = stockCount actual en Clover (entero, lo que les queda en vitrina virtual)
 * - null   = producto sin tracking de inventario (Edelweiss no le ha puesto stock,
 *            o no está mapeado a un item de Clover). Se trata como "always available".
 *
 * Cacheado 30 segundos en CDN para no saturar Clover. Si Edelweiss vende algo en
 * el mostrador, la web tardará máximo 30s en reflejarlo (aceptable).
 *
 * SEGURIDAD: el API Token NUNCA sale de este servidor.
 */

import { NextResponse } from "next/server";
import { products, effectiveCloverItemId } from "@/lib/products";

const isSandbox = process.env.NEXT_PUBLIC_ENV === "sandbox";
const CLOVER_API_URL = isSandbox
  ? "https://apisandbox.dev.clover.com"
  : "https://api.clover.com";

function getCredentials() {
  const merchantId = isSandbox
    ? process.env.CLOVER_SANDBOX_MERCHANT_ID
    : process.env.CLOVER_MERCHANT_ID;
  const apiToken = isSandbox
    ? process.env.CLOVER_SANDBOX_API_TOKEN
    : process.env.CLOVER_API_TOKEN;
  return { merchantId, apiToken };
}

export async function GET() {
  const { merchantId, apiToken } = getCredentials();
  if (!merchantId || !apiToken) {
    return NextResponse.json(
      { error: "Inventory not configured" },
      { status: 503 }
    );
  }

  // Construimos la lista de Clover item IDs que nos interesan (solo los del menú).
  const slugById = new Map<string, string>();
  for (const p of products) {
    const id = effectiveCloverItemId(p);
    if (id) slugById.set(id, p.slug);
  }

  if (slugById.size === 0) {
    return NextResponse.json({
      stocks: {},
      updatedAt: new Date().toISOString(),
      note: "No products mapped to Clover items in this environment.",
    });
  }

  try {
    // Endpoint bulk de stocks. Devuelve TODOS los stocks del merchant; filtramos.
    const stocksRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/item_stocks?limit=1000`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        // Cache de 30s para no saturar Clover en visitas concurrentes.
        next: { revalidate: 30 },
      }
    );

    if (!stocksRes.ok) {
      const errText = await stocksRes.text();
      console.error("[Clover Inventory] item_stocks failed:", errText);
      return NextResponse.json(
        { error: "Failed to fetch stock counts" },
        { status: 502 }
      );
    }

    const stocksData = await stocksRes.json();

    // Mapear: slug → stockCount
    const stocks: Record<string, number | null> = {};
    for (const p of products) {
      stocks[p.slug] = null; // por defecto, sin tracking
    }

    for (const stock of stocksData.elements || []) {
      // Cada elemento es { item: { id }, quantity, stockCount }
      const itemId = stock.item?.id;
      if (!itemId) continue;
      const slug = slugById.get(itemId);
      if (!slug) continue;
      // stockCount puede venir como número o no venir. Si no existe → null.
      const count =
        typeof stock.stockCount === "number"
          ? stock.stockCount
          : typeof stock.quantity === "number"
          ? Math.floor(stock.quantity)
          : null;
      stocks[slug] = count;
    }

    return NextResponse.json(
      {
        stocks,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("[Clover Inventory] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
