'use server'

import { cookies } from 'next/headers'

export async function hasAccessToken(): Promise<boolean> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')?.value
        return !!accessToken
    } catch (error: unknown) {
        console.error('Error checking access token:', error)
        return false
    }
}