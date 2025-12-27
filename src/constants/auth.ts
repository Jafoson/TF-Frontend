export const AUTH_COOKIE = 'accessToken'
export const REFRESH_COOKIE = 'refreshToken'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
export const AUTH_COOKIE_MAX_AGE = 60 * 15
export const REFRESH_COOKIE_MAX_AGE = 365 * 24 * 60 * 60