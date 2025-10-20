import { PaginationResponseDTO } from "@/types/pagination"
import { ResponseError, Response } from "@/types/response"
import { BulkTeamsParams, TeamBulkDTO } from "@/types/teams"

export async function getTeams(params: BulkTeamsParams = {}) {


    const searchParams = new URLSearchParams()
  
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.size) searchParams.append('size', params.size.toString())
  
    if (params.foundingDate) searchParams.append('year', params.foundingDate)
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
  
        console.log(`http://localhost:8091/api/teams/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
    
        // API-Aufruf an das Backend
        const backendResponse = await fetch(`http://localhost:8091/api/teams/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
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
  