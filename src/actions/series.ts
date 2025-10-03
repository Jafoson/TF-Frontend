'use server'

import { ResponseError, Response } from "@/types/response"
import { BulkSeriesParams, SeriesDTO } from "@/types/series"
import { PaginationResponseDTO } from "@/types/pagination"
import { FilterItem, FilterRequestDTO } from "@/types/filter"

export async function getSeries(params: BulkSeriesParams = {}) {


  const searchParams = new URLSearchParams()

  if (params.page) searchParams.append('page', params.page.toString())
  if (params.size) searchParams.append('size', params.size.toString())

  if (params.from) searchParams.append('from', params.from)
  if (params.duration) searchParams.append('duration', params.duration)
  if (params.sort) searchParams.append('sort', params.sort)
  if (params.order) searchParams.append('order', params.order)
  if (params.status) searchParams.append('status', params.status.join(','))
  if (params.team) searchParams.append('team', params.team.join(','))
  if (params.game) searchParams.append('game', params.game.join(','))
  if (params.start) searchParams.append('start', params.start)
  if (params.end) searchParams.append('end', params.end)
    
    try {
      // Explicitly check for development environment
      const isDev = process.env.NODE_ENV === 'development'
      const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

      console.log("searchParams:", searchParams.toString())

      console.log(`${apiUrl}/api/series${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
  
      // API-Aufruf an das Backend
      const backendResponse = await fetch(`${apiUrl}/api/series${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
  
      const data: Response<PaginationResponseDTO<SeriesDTO>> = await backendResponse.json()

  
      return {
        success: true,
        data: data.data,
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

  export async function getAllFormats(params: FilterRequestDTO = {}) {
    try {
      const isDev = process.env.NODE_ENV === 'development'
      const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
  
        const searchParams = new URLSearchParams()
  
        if (params.page !== undefined) searchParams.append('page', params.page.toString())
        if (params.size !== undefined) searchParams.append('size', params.size.toString())
        if (params.search !== undefined) searchParams.append('search', params.search.toString())
  
      const backendResponse = await fetch(`${apiUrl}/api/series/formats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
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
 
  export async function getAllStatus(params: FilterRequestDTO = {}) {
    try {
      const isDev = process.env.NODE_ENV === 'development'
      const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
  
        const searchParams = new URLSearchParams()
  
        if (params.page !== undefined) searchParams.append('page', params.page.toString())
        if (params.size !== undefined) searchParams.append('size', params.size.toString())
        if (params.search !== undefined) searchParams.append('search', params.search.toString())
  
      const backendResponse = await fetch(`${apiUrl}/api/series/status${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
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
  