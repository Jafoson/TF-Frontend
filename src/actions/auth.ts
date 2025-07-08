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