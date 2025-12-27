'use server'

import type { Response as ApiResponse, ResponseError } from '@/types/response'
import { fetchWithAuth } from './auth'

// API-URL Konfiguration
const isDev = process.env.NODE_ENV === 'development'
const API_URL = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
  requireAuth?: boolean
  skipRedirect?: boolean
}

/**
 * Fetch-Funktion mit vorgegebener API-URL und automatischer Token-Verwaltung
 * 
 * @param endpoint - API Endpoint (z.B. '/api/user' oder '/api/teams')
 * @param options - Fetch-Optionen (method, body, headers, etc.)
 * @returns Promise mit der Response
 * 
 * @example
 * // GET Request
 * const response = await apiFetch('/api/user')
 * const data = await response.json()
 * 
 * @example
 * // POST Request mit Body
 * const response = await apiFetch('/api/teams', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'Team 1' })
 * })
 * 
 * @example
 * // Request ohne Auth
 * const response = await apiFetch('/api/public/data', {
 *   requireAuth: false
 * })
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
  const {  requireAuth = true, headers = {}, ...fetchOptions } = options

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (requireAuth) {
    const { skipRedirect, ...authOptions } = fetchOptions
    const response = await fetchWithAuth(endpoint, {
      ...authOptions,
      headers: requestHeaders,
      skipRedirect,
    })
    return response
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  })

  return response
}

/**
 * Typisierte Fetch-Funktion, die automatisch JSON parst
 * 
 * @param endpoint - API Endpoint
 * @param options - Fetch-Optionen
 * @returns Promise mit geparsten Daten vom Typ Response<T>
 * 
 * @example
 * const result = await apiFetchJson<UserDTO>('/api/user')
 * if (result.success) {
 *   console.log(result.data)
 * }
 */
export async function apiFetchJson<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const response = await apiFetch(endpoint, options)
  const data: ApiResponse<T> = await response.json()
  return data
}

/**
 * Typisierte Fetch-Funktion mit Fehlerbehandlung
 * Gibt immer Response<T> oder ResponseError zurück (konsistent mit Backend-Format)
 * 
 * @param endpoint - API Endpoint
 * @param options - Fetch-Optionen
 * @returns Promise mit Response<T> bei Erfolg oder ResponseError bei Fehler
 * 
 * @example
 * const result = await apiFetchData<UserDTO>('/api/user')
 * if (result.success) {
 *   // result ist Response<UserDTO>
 *   console.log(result.data)
 * } else {
 *   // result ist ResponseError
 *   console.error('Fehler Code:', result.code)
 *   console.error('Fehler Details:', result.errors)
 * }
 */
export async function apiFetchData<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T> | ResponseError> {
  try {
    const response = await apiFetch(endpoint, options)

    if (!response.ok) {
      let error: ResponseError | null = null
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const parsed = await response.json()
          // Prüfe ob es bereits ein ResponseError Format ist
          if (parsed.success === false && parsed.code) {
            error = parsed as ResponseError
          } else {
            // Konvertiere zu ResponseError Format
            error = {
              code: parsed.code || `HTTP_${response.status}`,
              errors: parsed.errors,
              success: false,
            }
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError)
      }

      // Erstelle ResponseError wenn kein Error vom Backend kam
      const errorResponse: ResponseError = error || {
        code: `HTTP_${response.status}`,
        success: false,
      }

      console.error(`API Error [${endpoint}]:`, errorResponse)
      
      return errorResponse
    }

    // Erfolgreiche Response parsen
    const result: ApiResponse<T> = await response.json()
    return result
  } catch (error) {
    // Bei Netzwerkfehlern oder anderen Exceptions
    const errorResponse: ResponseError = {
      code: 'FETCH_ERROR',
      success: false,
    }
    
    console.error(`API Fetch Error [${endpoint}]:`, error)
    
    return errorResponse
  }
}

