'use server'

import { FilterItem, FilterRequestDTO } from "@/types/filter"
import { PaginationResponseDTO } from "@/types/pagination"
import { ResponseError, Response } from "@/types/response"
import { BulkTeamsParams, TeamBulkDTO } from "@/types/teams"

export async function getTeams(params: BulkTeamsParams = {}) {


    const searchParams = new URLSearchParams()
  
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.size) searchParams.append('size', params.size.toString())
  
    if (params.foundingYear) searchParams.append('foundingYear', params.foundingYear.toString())
    if (params.gameId) searchParams.append('gameId', params.gameId.join(','))
    if (params.regionId) searchParams.append('regionId', params.regionId)
    if (params.orgaId) searchParams.append('orgaId', params.orgaId)

    // Sortierung
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.append('sortDirection', params.sortOrder)

      try {
        // Explicitly check for development environment
        const isDev = process.env.NODE_ENV === 'development'
        const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
  
        console.log("searchParams:", searchParams.toString())
  
        console.log(`${apiUrl}/api/teams/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
    
        // API-Aufruf an das Backend
        const backendResponse = await fetch(`${apiUrl}/api/teams/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
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
    
        const data: Response<PaginationResponseDTO<TeamBulkDTO>> = await backendResponse.json()
  
    
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
  
    export async function getAllFoundingYears(params: FilterRequestDTO = {}) {
      try {
        const isDev = process.env.NODE_ENV === 'development'
        const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
    
          const searchParams = new URLSearchParams()
    
          if (params.page !== undefined) searchParams.append('page', params.page.toString())
          if (params.size !== undefined) searchParams.append('size', params.size.toString())
          if (params.search !== undefined) searchParams.append('search', params.search.toString())
    
        const backendResponse = await fetch(`${apiUrl}/api/teams/founding/filter${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
    
        console.log('Founding years response status:', backendResponse.status)
    
        if (!backendResponse.ok) {
          const error: ResponseError = await backendResponse.json()
          console.log('Founding years error:', error)
          return {
            success: false,
            code: error.code || 'FOUNDING_YEARS_FETCH_ERROR',
            errors: error.errors,
          }
        }
    
        const data: Response<PaginationResponseDTO<FilterItem[]>> = await backendResponse.json()
    
        return {
          success: true,
          data: data.data,
        }
      } catch (error) {
        console.error('Fehler beim Laden der Gründungsjahre:', error)
        return {
          success: false,
          error: 'Interner Serverfehler',
          details: null,
        }
      }
    }