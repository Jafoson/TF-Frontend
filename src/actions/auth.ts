'use server'

import { cookies } from 'next/headers'
import type { RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO } from '@/types/auth'
import type { Response, ResponseError } from '@/types/response'

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
  
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
  
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
    
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API_URL from env:', process.env.API_URL)
    console.log('Using API URL:', apiUrl)
    console.log('Full endpoint:', `${apiUrl}/api/auth/request-mail-reset`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/request-mail-reset`, {
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
    console.log('Full endpoint:', `${apiUrl}/api/auth/reset-mail`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/auth/reset-mail`, {
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