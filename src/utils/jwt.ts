import type { JWTPayload } from '@/types/jwt'

// Token Payload lesen 
export function decodeToken(token: string): JWTPayload | null {
try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    const jsonString = atob(payloadBase64)
    return JSON.parse(jsonString)
} catch (e: unknown) {
    console.error('Error decoding token:', e)
    return null
}
}

// Prüfen, ob Token abgelaufen ist
export function isTokenExpired(token: string): boolean {
const payload = decodeToken(token)
if (!payload) return true

const currentTime = Math.floor(Date.now() / 1000)
return currentTime > (payload.exp - 30)
}

  