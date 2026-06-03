/**
 * CLOVER ORDERS API
 *
 * POST /api/clover/orders
 * Crea un pedido en Clover cuando el cliente completa el checkout.
 *
 * Body esperado:
 * {
 *   items: [{ itemId: string, name: string, price: number, quantity: number }]
 *   customer: { name: string, email: string, phone: string }
 *   pickupTime: string (ISO 8601)
 *   notes?: string
 * }
 *
 * SEGURIDAD:
 * - El token de Clover NUNCA se expone al frontend
 * - Se valida el body de entrada antes de procesar
 * - Rate limiting recomendado (implementar con middleware)
 * Ver SECURITY.md para más detalles.
 */

import { NextRequest, NextResponse } from 'next/server'

const isSandbox = process.env.NEXT_PUBLIC_ENV === 'sandbox'
const CLOVER_API_URL = isSandbox
  ? 'https://apisandbox.dev.clover.com'
  : 'https://api.clover.com'

// Validación básica del body (sin Zod por simplicidad inicial)
function validateOrderBody(body: any): { valid: boolean; error?: string } {
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return { valid: false, error: 'items must be a non-empty array' }
  }
  if (!body.customer?.name || !body.customer?.email) {
    return { valid: false, error: 'customer.name and customer.email are required' }
  }
  if (!body.pickupTime) {
    return { valid: false, error: 'pickupTime is required' }
  }
  // Validar que pickupTime sea futuro
  const pickup = new Date(body.pickupTime)
  if (isNaN(pickup.getTime()) || pickup < new Date()) {
    return { valid: false, error: 'pickupTime must be a valid future date' }
  }
  // Validar horario: Martes-Domingo 7am-2pm Eastern
  const pickupHour = pickup.getHours()
  const pickupDay = pickup.getDay() // 0=domingo, 1=lunes, ...6=sábado
  if (pickupDay === 1) { // Lunes = cerrado
    return { valid: false, error: 'Edelweiss is closed on Mondays' }
  }
  if (pickupHour < 7 || pickupHour >= 14) {
    return { valid: false, error: 'Pickup time must be between 7am and 2pm' }
  }
  return { valid: true }
}

export async function POST(request: NextRequest) {
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

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  // Validar input
  const validation = validateOrderBody(body)
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    )
  }

  const { items, customer, pickupTime, notes } = body

  try {
    // 1. Crear la orden en Clover
    const orderRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Online Order - ${customer.name}`,
          note: `Pickup: ${new Date(pickupTime).toLocaleString('en-US', { timeZone: 'America/New_York' })}${notes ? ` | Notes: ${notes}` : ''}`,
          orderType: { id: 'online' },
          state: 'open',
          manualTransaction: false,
        }),
      }
    )

    if (!orderRes.ok) {
      const errorText = await orderRes.text()
      console.error('[Clover Orders] Error creating order:', errorText)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 502 }
      )
    }

    const order = await orderRes.json()
    const orderId = order.id

    // 2. Añadir los line items a la orden
    const lineItemPromises = items.map((item: any) =>
      fetch(
        `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}/line_items`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item: { id: item.itemId },
            name: item.name,
            price: Math.round(item.price * 100), // Convertir a centavos
            unitQty: item.quantity,
          }),
        }
      )
    )

    await Promise.all(lineItemPromises)

    console.log(`[Clover Orders] Orden creada: ${orderId} para ${customer.name}`)

    // 3. Devolver el ID de la orden (para el checkout de pago)
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created successfully',
    })

  } catch (err) {
    console.error('[Clover Orders] Error inesperado:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/clover/orders?orderId=XXX — Consultar estado de una orden
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json(
      { error: 'orderId is required' },
      { status: 400 }
    )
  }

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
    const orderRes = await fetch(
      `${CLOVER_API_URL}/v3/merchants/${merchantId}/orders/${orderId}?expand=lineItems`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!orderRes.ok) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = await orderRes.json()

    return NextResponse.json({
      orderId: order.id,
      state: order.state,
      total: order.total / 100,
      createdAt: order.createdTime,
      lineItems: order.lineItems?.elements?.map((li: any) => ({
        name: li.name,
        price: li.price / 100,
        quantity: li.unitQty,
      })) || [],
    })

  } catch (err) {
    console.error('[Clover Orders GET] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
