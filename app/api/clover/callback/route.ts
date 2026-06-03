/**
 * CLOVER OAUTH CALLBACK
 *
 * Esta ruta recibe el código de autorización de Clover después de que
 * el merchant (Edelweiss) autoriza nuestra app.
 *
 * Flujo:
 * 1. Redirigimos a Clover: /oauth/authorize?client_id=...
 * 2. Edelweiss acepta los permisos
 * 3. Clover nos redirige aquí con ?code=XXX&merchant_id=YYY
 * 4. Intercambiamos el código por un token de acceso
 * 5. Guardamos el token (en producción: en DB o variable de entorno)
 *
 * SEGURIDAD: Esta ruta nunca expone el token al frontend.
 * Ver SECURITY.md para más detalles.
 */

import { NextRequest, NextResponse } from 'next/server'

const isSandbox = process.env.NEXT_PUBLIC_ENV === 'sandbox'
const CLOVER_BASE_URL = isSandbox
  ? 'https://sandbox.dev.clover.com'
  : 'https://www.clover.com'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const merchantId = searchParams.get('merchant_id')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Si Clover devuelve error
  if (error) {
    console.error('[Clover OAuth] Error recibido:', error)
    return NextResponse.redirect(
      new URL('/?clover_error=' + error, request.url)
    )
  }

  // Verificar que tenemos el código
  if (!code || !merchantId) {
    console.error('[Clover OAuth] Faltan parámetros: code o merchant_id')
    return NextResponse.json(
      { error: 'Missing code or merchant_id' },
      { status: 400 }
    )
  }

  const appId = isSandbox
    ? process.env.CLOVER_SANDBOX_APP_ID
    : process.env.CLOVER_APP_ID

  const appSecret = isSandbox
    ? process.env.CLOVER_SANDBOX_APP_SECRET
    : process.env.CLOVER_APP_SECRET

  if (!appId || !appSecret) {
    console.error('[Clover OAuth] Faltan variables de entorno: APP_ID o APP_SECRET')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  try {
    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch(
      `${CLOVER_BASE_URL}/oauth/token?client_id=${appId}&client_secret=${appSecret}&code=${code}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[Clover OAuth] Error al obtener token:', errorText)
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error('[Clover OAuth] No se recibió access_token:', tokenData)
      return NextResponse.json(
        { error: 'No access token received' },
        { status: 500 }
      )
    }

    // ============================================================
    // IMPORTANTE (SANDBOX / DESARROLLO):
    // En sandbox, mostramos el token en pantalla para copiarlo al .env.local
    //
    // EN PRODUCCIÓN: NUNCA mostrar el token. Guardarlo en:
    //   - Variables de entorno de Vercel (para un solo merchant)
    //   - Base de datos cifrada (para múltiples merchants)
    // ============================================================

    if (isSandbox) {
      // Solo en desarrollo: mostrar token para copiarlo al .env.local
      return NextResponse.json({
        success: true,
        message: 'OAuth completado. Copia estos valores a tu .env.local',
        sandbox: true,
        values: {
          CLOVER_SANDBOX_MERCHANT_ID: merchantId,
          CLOVER_SANDBOX_API_TOKEN: accessToken,
        },
        next_step: 'Pega estos valores en .env.local y reinicia el servidor de desarrollo'
      })
    }

    // PRODUCCIÓN: guardar token en variable de entorno (via Vercel API)
    // Por ahora redirigimos a home con éxito
    console.log('[Clover OAuth] Token obtenido para merchant:', merchantId)

    return NextResponse.redirect(new URL('/?clover_connected=true', request.url))

  } catch (err) {
    console.error('[Clover OAuth] Error inesperado:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
