import { NextResponse } from 'next/server';
import type { RegisterRequestDTO, AuthResponseDTO } from '@/types/auth';
import { registerSchema } from '@/schemas/auth';

export async function POST(request: Request) {
  try {
    const body: RegisterRequestDTO = await request.json();

    console.log(`${process.env.API_URL}/api/auth/register`)

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${process.env.API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(backendResponse.status)

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(
        { error: error.message || 'Registrierung fehlgeschlagen' },
        { status: backendResponse.status }
      );
    }

    const data: AuthResponseDTO = await backendResponse.json();
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    const response = NextResponse.json({
      user: data.user,
    }, { status: 201 });
  
    // Set HttpOnly cookies for both tokens
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
  
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  
    return response;
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 