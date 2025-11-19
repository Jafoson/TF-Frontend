'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO } from '@/types/auth'
import type { Response, ResponseError } from '@/types/response'
import { generateCodeChallenge, generateCodeVerifier } from '@/utils/codeVerifier'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || ''

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const body: RegisterRequestDTO = {
      email,
      username,
      password,
    }

    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API_URL from env:', process.env.API_URL)
    console.log('Using API URL:', apiUrl)
    console.log('Full endpoint:', `${apiUrl}/api/auth/register`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log(backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log(error)
      return {
        success: false,
        code: error.code || 'REGISTRATION_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<AuthResponseDTO> = await backendResponse.json()
    const accessToken = data.data.accessToken
    const refreshToken = data.data.refreshToken

    // Set HttpOnly cookies for both tokens
    const cookieStore = await cookies()
    
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
  
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      user: data.data.user,
    }
  } catch (error) {
    console.error('Registrierungsfehler:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const usernameOrEmail = formData.get('usernameOrEmail') as string
    const password = formData.get('password') as string

    const body: LoginRequestDTO = {
      usernameOrEmail,
      password,
    }

    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API_URL from env:', process.env.API_URL)
    console.log('Using API URL:', apiUrl)
    console.log('Full endpoint:', `${apiUrl}/api/auth/login`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log(backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log(error)
      return {
        success: false,
        code: error.code || 'HALLO FEHLER',
      }
    }

    const data: Response<AuthResponseDTO> = await backendResponse.json()
    const accessToken = data.data.accessToken
    const refreshToken = data.data.refreshToken

    // Set HttpOnly cookies for both tokens
    const cookieStore = await cookies()
    
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
  
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      user: data.data.user,
    }
  } catch (error) {
    console.error('Login-Fehler:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
} 

export async function verifyCode(formData: FormData) {
  try {
    const code = formData.get('code') as string

    const body = {
      code,
    }

    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API_URL from env:', process.env.API_URL)
    console.log('Using API URL:', apiUrl)
    console.log('Full endpoint:', `${apiUrl}/api/auth/verify-code`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log(backendResponse.status)

    const data = await backendResponse.json()
    console.log(data)

    return {
      success: data.success,
      code: data.code,
    }
  } catch (error) {
    console.error('Verify-Code-Fehler:', error)
    return {
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
    }
  }
} 

export async function resendVerificationEmail(formData: FormData) {
  try {
    const email = formData.get('email') as string
    console.log('Extrahierte E-Mail aus FormData:', email)
    console.log('E-Mail ist leer/null:', !email)

    const body = {
      email,
    }
    console.log('Request Body:', JSON.stringify(body))

    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API_URL from env:', process.env.API_URL)
    console.log('Using API URL:', apiUrl)
    console.log('Full endpoint:', `${apiUrl}/api/auth/resend-verification`)

    // API-Aufruf an das Backend (POST-Request)
    const backendResponse = await fetch(`${apiUrl}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log(backendResponse.status)

    const data = await backendResponse.json()
    console.log(data)

    return {
      success: data.success,
      code: data.code,
    }
  } catch (error) {
    console.error('Resend-Verification-Fehler:', error)
    return {
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
    }
  }
} 

export async function requestPasswordReset(formData: FormData) {
  try {
    const email = formData.get('email') as string

    const body = {
      email,
    }

    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })


    const data = await backendResponse.json()

    return {
      success: data.success,
      code: data.code,
    }
  } catch (error) {
    console.error('Request-Password-Reset-Fehler:', error)
    return {
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
    }
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const token = formData.get('token') as string
    const newPassword = formData.get('newPassword') as string

    const body = {
      token,
      newPassword,
    }

    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API_URL from env:', process.env.API_URL)
    console.log('Using API URL:', apiUrl)
    console.log('Full endpoint:', `${apiUrl}/api/auth/reset-password`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log(backendResponse.status)

    const data = await backendResponse.json()
    console.log(data)

    return {
      success: data.success,
      code: data.code,
    }
  } catch (error) {
    console.error('Reset-Password-Fehler:', error)
    return {
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
    }
  }
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

 