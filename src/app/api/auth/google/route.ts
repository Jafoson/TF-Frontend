// /app/api/auth/google/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const API_URL = process.env.API_URL!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const cookieStore = await cookies()
  const codeVerifier = cookieStore.get("pkce_verifier")?.value;

  if (!code) {
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=missing_code`);
  }

  if (!codeVerifier) {
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=missing_code_verifier`);
  }

  // 1. Tausche Code gegen Token bei Google
  const tokenRequestBody = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier
  });

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenRequestBody,
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    console.error('Google OAuth token exchange failed:', tokenData);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=token_exchange_failed`);
  }

  const accessToken = tokenData.access_token;

  // 2. Sende Token an dein Spring Boot Backend
  const backendResponse = await fetch(`${API_URL}/api/auth/oauth2/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accessToken }),
  });

  console.log('Backend response status:', backendResponse.status);

  if (!backendResponse.ok) {
    console.error('Backend authentication failed:', backendResponse.status);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=backend_auth_failed`);
  }

  const backendData = await backendResponse.json();
  console.log('Backend data:', backendData);

  // 3. Setze Cookies wie bei normalem Login
  if (backendData.data?.accessToken && backendData.data?.refreshToken) {
    const accessToken = backendData.data.accessToken;
    const refreshToken = backendData.data.refreshToken;

    // Set HttpOnly cookies for both tokens
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });
  
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Clean up PKCE verifier cookie
    cookieStore.delete('pkce_verifier');

    // Redirect to dashboard or home page
    return NextResponse.redirect(`${FRONTEND_URL}/dashboard`);
  } else {
    console.error('Backend response missing tokens:', backendData);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=invalid_backend_response`);
  }
}