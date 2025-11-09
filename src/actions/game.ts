'use server'

import {ResponseError, Response} from "@/types/response"
import { PaginationResponseDTO } from "@/types/pagination"
import { 
  GameDTO, 
  GameBatchRequest,
  BulkGameDTO,
  BulkGamesParams
} from "@/types/game"
import {FilterItem, FilterRequestDTO} from "@/types/filter";

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

// Referenzdaten-Endpunkte

/**
 * Alle verfügbaren Genres abrufen
 */
export async function getAllGenres(params: FilterRequestDTO) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

    const backendResponse = await fetch(`${apiUrl}/api/game/genre${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Genres response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Genres error:', error)
      return {
        success: false,
        code: error.code || 'GENRES_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()
    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Genres:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

/**
 * Alle verfügbaren Plattformen abrufen
 */
export async function getAllPlatforms(params: FilterRequestDTO) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

    const backendResponse = await fetch(`${apiUrl}/api/game/platform${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Platforms response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Platforms error:', error)
      return {
        success: false,
        code: error.code || 'PLATFORMS_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Plattformen:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

/**
 * Alle verfügbaren Altersfreigaben abrufen
 */
export async function getAllAgeRatings(params: FilterRequestDTO) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

    const backendResponse = await fetch(`${apiUrl}/api/game/age${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Age ratings response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Age ratings error:', error)
      return {
        success: false,
        code: error.code || 'AGE_RATINGS_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Altersfreigaben:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

/**
 * Alle verfügbaren Entwickler abrufen
 */
export async function getAllDevelopers(params: FilterRequestDTO = {}) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())



      const backendResponse = await fetch(`${apiUrl}/api/game/developer${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Developers response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Developers error:', error)
      return {
        success: false,
        code: error.code || 'DEVELOPERS_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Entwickler:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

/**
 * Alle verfügbaren Veröffentlichungsjahre abrufen
 */
export async function getAllPublishYears(params: FilterRequestDTO = {}) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

    const backendResponse = await fetch(`${apiUrl}/api/game/publishyear${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Publish years response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Publish years error:', error)
      return {
        success: false,
        code: error.code || 'PUBLISH_YEARS_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Veröffentlichungsjahre:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

export async function getAllGames(params: FilterRequestDTO = {}) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

    const backendResponse = await fetch(`${apiUrl}/api/game/all${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Publish years response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Publish years error:', error)
      return {
        success: false,
        code: error.code || 'PUBLISH_YEARS_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Veröffentlichungsjahre:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}

/**
 * Paginierte Spieleliste mit Filtern und Sortierung abrufen
 */
export async function getBulkGames(params: BulkGamesParams = {}) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

    // Debug: Zeige die erhaltenen Parameter
    console.log('🔍 getBulkGames - Erhaltene Parameter:', params)

    // Query Parameter aufbauen
    const searchParams = new URLSearchParams()
    
    // Pagination
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
    
    // Filter
    if (params.genreIds && params.genreIds.length > 0) {
      searchParams.append('genreIds', params.genreIds.join(','))
    }
    if (params.publishingYear !== undefined) {
      searchParams.append('publishingYear', params.publishingYear.toString())
    }
    if (params.developerIds && params.developerIds.length > 0) {
      searchParams.append('developerIds', params.developerIds.join(','))
    }
    if (params.ageIds && params.ageIds.length > 0) {
      searchParams.append('ageIds', params.ageIds.join(','))
    }
    if (params.platformIds && params.platformIds.length > 0) {
      searchParams.append('platformIds', params.platformIds.join(','))
    }
    
    // Sortierung
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection)

    const url = `${apiUrl}/api/game/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    // Debug: Zeige die finale URL
    console.log('🔍 getBulkGames - Finale URL:', url)
    console.log('🔍 getBulkGames - Query Parameters:', searchParams.toString())
    
    const backendResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Bulk games response status:', backendResponse.status)

    if (!backendResponse.ok) {
      const error: ResponseError = await backendResponse.json()
      console.log('Bulk games error:', error)
      return {
        success: false,
        code: error.code || 'BULK_GAMES_FETCH_ERROR',
        errors: error.errors,
      }
    }

    const data: Response<PaginationResponseDTO<BulkGameDTO>> = await backendResponse.json()

    console.log('Bulk games data:', data.data.data)

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('Fehler beim Laden der Bulk Games:', error)
    return {
      success: false,
      error: 'Interner Serverfehler',
      details: null,
    }
  }
}
