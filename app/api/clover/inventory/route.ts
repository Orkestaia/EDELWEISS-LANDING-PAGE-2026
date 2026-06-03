/**
 * CLOVER INVENTORY API
 *
 * GET /api/clover/inventory
 * Devuelve todos los productos activos del menú de Edelweiss.
 *
 * Respuesta cacheada 5 minutos para no saturar la API de Clover.
 * El caché se invalida cuando Edelweiss cambia productos en su POS.
 *
 * SEGURIDAD: El API Token NUNCA sale de este servidor.
 * Ver SECURITY.md para más detalles.
 */

import { NextRequest, NextResponse } from 'next/server'

const isSandbox = process.env.NEXT_PUBLIC_ENV === 'sandbox'
const CLOVER_API_URL = isSandbox
  ? 'https://apisandbox.dev.clover.com'
  : 'https://api.clover.com'

export async function GET(request: NextRequest) {
  const merchantId = isSandbox
    ? process.env.CLOVER_SANDBOX_MERCHANT_ID
    : process.env.CLOVER_MERCHANT_ID

  const apiToken = isSandbox
    ? process.env.CLOVER_SANDBOX_API_TOKEN
    : process.env.CLOVER_API_TOKEN

  if (!merchantId || !apiToken) {
    return NextResponse.json(
      { error: 'Clover not configured' },
      { status: 503 }
    )
  }

  try {
    // Obtener productos
    const [itemsRes, categoriesRes] = await Promise.all([
      fetch(
        `${CLOVER_API_URL}/v3/merchants/${merchantId}/items?expand=categories`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          // Caché de 5 minutos (Next.js revalidation)
          next: { revalidate: 300 },
        }
      ),
      fetch(
        `${CLOVER_API_URL}/v3/merchants/${merchantId}/categories`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          next: { revalidate: 300 },
        }
      ),
    ])

    if (!itemsRes.ok) {
      const errorText = await itemsRes.text()
      console.error('[Clover Inventory] Error fetching items:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 502 }
      )
    }

    const itemsData = await itemsRes.json()
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { elements: [] }

    // Transformar para la web (no exponer datos internos de Clover)
    const items = (itemsData.elements || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price / 100, // Clover guarda precios en centavos
      description: item.alternateName || '',
      category: item.categories?.elements?.[0]?.name || 'Uncategorized',
      available: item.available !== false,
      imageUrl: item.imageUrl || null,
    }))

    const categories = (categoriesData.elements || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder || 0,
    }))

    return NextResponse.json(
      {
        items,
        categories,
        total: items.length,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    )

  } catch (err) {
    console.error('[Clover Inventory] Error inesperado:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
