'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO, VerifyCodeRequestDTO, EmailRequestDTO, ResetPasswordRequestDTO } from '@/types/auth'
import type { Response, ResponseError } from '@/types/response'
import { generateCodeChallenge, generateCodeVerifier } from '@/utils/codeVerifier'
import { emailSchema, loginSchema, passwordSchema, registerSchema, verifyCodeSchema } from '@/schemas/auth'
import { apiFetchData } from '@/utils/api'
import { setCookie } from '@/utils/cookies'
import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE, REFRESH_COOKIE, REFRESH_COOKIE_MAX_AGE } from '@/constants/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || ''

export async function registerUser( formData: FormData): Promise<Response<AuthResponseDTO> | ResponseError> {
  const validatedData = registerSchema.safeParse({
    email: formData.get('email') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  })

  if (!validatedData.success) {
    return {
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }
  
  const body: RegisterRequestDTO = {
    email: validatedData.data.email,
    username: validatedData.data.username,
    password: validatedData.data.password,
  }

  const response = await apiFetchData<AuthResponseDTO>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  const { data } = response as Response<AuthResponseDTO>
  
  
  try {
    await setCookie(AUTH_COOKIE, data.accessToken, AUTH_COOKIE_MAX_AGE)
  } catch (error) {
    console.error('❌ Register: Failed to set accessToken cookie:', error)
  }
  
  try {
    await setCookie(REFRESH_COOKIE, data.refreshToken, REFRESH_COOKIE_MAX_AGE)
  } catch (error) {
    console.error('❌ Register: Failed to set refreshToken cookie:', error)
  }

  return response as Response<AuthResponseDTO>
}

export async function loginUser(formData: FormData): Promise<Response<AuthResponseDTO> | ResponseError> {
 
  const validatedData = loginSchema.safeParse({
    password: formData.get('password') as string,
  })

  if (!validatedData.success) {
    return {  
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }
  
  const body: LoginRequestDTO = {
    usernameOrEmail: formData.get('usernameOrEmail') as string,
    password: validatedData.data.password,
  }

  const response = await apiFetchData<AuthResponseDTO>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  const { data } = response as Response<AuthResponseDTO>
  
  
  try {
    await setCookie(AUTH_COOKIE, data.accessToken, AUTH_COOKIE_MAX_AGE)
  } catch (error) {
    console.error('❌ Login: Failed to set accessToken cookie:', error)
  }
  
  try {
    await setCookie(REFRESH_COOKIE, data.refreshToken, REFRESH_COOKIE_MAX_AGE)
  } catch (error) {
    console.error('❌ Login: Failed to set refreshToken cookie:', error)
  }

  return response as Response<AuthResponseDTO>
}

export async function verifyCode(formData: FormData): Promise<Response<void> | ResponseError> {
  
  const validatedData = verifyCodeSchema.safeParse({
    code: formData.get('code') as string,
  })

  if (!validatedData.success) {
    return {
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }
  
  const body: VerifyCodeRequestDTO = {
    code: validatedData.data.code,
  }

  const response = await apiFetchData<void>('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify(body),
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<void>
}

export async function resendVerificationEmail(formData: FormData): Promise<Response<void> | ResponseError> {
  
  const validatedData = emailSchema.safeParse({
    email: formData.get('email') as string,
  })

  if (!validatedData.success) {
    return {
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }
  
  const body: EmailRequestDTO = {
    email: validatedData.data.email,
  }

  const response = await apiFetchData<void>('/api/auth/resend-verification-email', {
    method: 'POST',
    body: JSON.stringify(body),
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<void>
}

export async function requestPasswordReset(formData: FormData): Promise<Response<void> | ResponseError> {
  
  const validatedData = emailSchema.safeParse({
    email: formData.get('email') as string,
  })

  if (!validatedData.success) {
    return {
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }

  const body: EmailRequestDTO = {
    email: validatedData.data.email,
  }

  const response = await apiFetchData<void>('/api/auth/request-password-reset', {
    method: 'POST',
    body: JSON.stringify(body),
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<void>
}

export async function resetPassword(formData: FormData): Promise<Response<void> | ResponseError> {
  
  const validatedData = passwordSchema.safeParse({
    token: formData.get('token') as string,
    newPassword: formData.get('newPassword') as string,
  })

  if (!validatedData.success) {
    return {
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }
  
  const body: ResetPasswordRequestDTO = {
    token: formData.get('token') as string,
    newPassword: validatedData.data.newPassword,
  }

  const response = await apiFetchData<void>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<void>
}


export async function loginWithGoogle() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const cookieStore = await cookies()

  cookieStore.set('pkce_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300, // 5 minutes
    path: '/',
  })

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  redirect(url.toString());
}

export async function loginWithApple() {
  // Redirect to Apple OAuth endpoint  
  redirect('http://localhost:8080/api/auth/apple')
}

 