'use server'

import { ResponseError, Response } from "@/types/response"
import { GameDTO, GameBatchRequest } from "@/types/game"

export async function getGamesBatch(gameIds: string[]) {
  try {
    // Explicitly check for development environment
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

    const requestBody: GameBatchRequest = {
      gameIds: gameIds
    }

    // API-Aufruf an das Backend
    const backendResponse = await fetch(`${apiUrl}/api/game/batch/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Game batch response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Game batch error:', error)
      return {
        success: false,
        code: error.code || 'GAME_BATCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<GameDTO[]> = await backendResponse.json()

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Games:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}
