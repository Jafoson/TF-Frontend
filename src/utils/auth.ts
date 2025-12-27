'use server'

import { redirect } from '@/i18n/navigation'
import { AUTH_COOKIE, REFRESH_COOKIE, API_BASE_URL, AUTH_COOKIE_MAX_AGE } from '@/constants/auth'
import { decodeToken, isTokenExpired } from '@/utils/jwt'
import { getCookie, setCookie } from './cookies'





// Tokens erneuern
async function refreshTokens(refreshToken: string) {

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      console.error('Error refreshing tokens with status:', res.statusText)
      return null
    }

    const data = await res.json()
    return {
      accessToken: data.data as string,
    }
  } catch (error: unknown) {
    console.error('Error refreshing tokens:', error)
    return null
  }
}


/**
 * Prüft ob User Scope hat.
 * Nutzung: 
 * - if (await hasPermission('admin')) { ... }
 * - if (await hasPermission(['admin', 'moderator'])) { ... }
 * 
 * @param requiredPermission - Einzelne Permission oder Array von Permissions
 * @returns true wenn User mindestens eine der angegebenen Permissions hat
*/

export async function hasPermission(requiredPermission: string | string[]): Promise<boolean> {
  const token = await getCookie(AUTH_COOKIE)

  if (!token) return false

  const payload = decodeToken(token)
  if (!payload) return false

  const scopes = payload.scopes || []

  // Wenn Array: prüfe ob mindestens eine Permission vorhanden ist
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(permission => scopes.includes(permission))
  }

  // Wenn String: prüfe ob Permission vorhanden ist
  return scopes.includes(requiredPermission)
}
/**
 * Fetch mit Auth
 * Nutzung: const data = await fetchWithAuth('/users')
 * 
 * @param endpoint - API Endpoint
 * @param options - Fetch-Optionen mit optionalem skipRedirect
 * @param options.skipRedirect - Wenn true, wird kein Redirect bei fehlendem Token durchgeführt
 */
export async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit & { skipRedirect?: boolean } = {}
) {
  const { skipRedirect = false, ...fetchOptions } = options
  let accessToken = await getCookie(AUTH_COOKIE)
  const refreshToken = await getCookie(REFRESH_COOKIE)
  const fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Check: Ist Token abgelaufen?
  if (!accessToken || isTokenExpired(accessToken)) {
    console.log('🔒 Auth: Token abgelaufen, starte Refresh...')

    if (!refreshToken) {
      console.log('❌ Auth: Kein Refresh Token -> Logout')
      if (!skipRedirect) {
        redirect({href: '/login', locale: 'en'})
      }
      // Wenn skipRedirect, wirf einen Fehler
      throw new Error('No refresh token available')
    }

    const newTokens = await refreshTokens(refreshToken as string)

    if (!newTokens) {
      console.log('❌ Auth: Refresh fehlgeschlagen -> Logout')
      // Bei Fehler: Lösche beide Tokens
      try {
        await setCookie(AUTH_COOKIE, '', 0)
        await setCookie(REFRESH_COOKIE, '', 0)
      } catch (cookieError) {
        console.error('❌ Auth: Failed to set cookies:', cookieError)
      }
      if (!skipRedirect) {
        redirect({href: '/login', locale: 'en'})
      }
      // Wenn skipRedirect, wirf einen Fehler
      throw new Error('Token refresh failed')
    }

    // Neue Tokens setzen
    if (newTokens) {
      accessToken = newTokens.accessToken as string
      try {
        await setCookie(AUTH_COOKIE, newTokens.accessToken, AUTH_COOKIE_MAX_AGE)
        console.log('✅ Auth: Neuer AccessToken im Cookie gesetzt')
      } catch (cookieError) {
        // Wenn Cookie-Setzen fehlschlägt (z.B. in Server Component Context),
        // verwende den Token trotzdem für diesen Request
        console.warn('⚠️ Auth: Cookie konnte nicht gesetzt werden, verwende Token trotzdem:', cookieError)
      }
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
    'Authorization': `Bearer ${accessToken}`
  } as Record<string, string>

  const response = await fetch(fullUrl, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    console.log('❌ Auth: Backend lehnte Token ab (401) -> Logout')
    if (!skipRedirect) {
      redirect({href: '/login', locale: 'en'})
    }
    // Wenn skipRedirect, wirf einen Fehler
    throw new Error('Unauthorized: Token rejected by backend')
  }

  return response
}
