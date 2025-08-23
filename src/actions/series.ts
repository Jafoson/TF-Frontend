'use server'

import { ResponseError, Response } from "@/types/response"
import { SeriesDTO } from "@/types/series"
import { PaginationResponseDTO } from "@/types/pagination"
import { formatDateForApi } from "@/utils/formatingDate"
import { StatusEnum } from "@/enum/statusEnum"

export async function getSeries(page: number, size: number) {
    const from = formatDateForApi(new Date(Date.now()+ 30 * 60 * 1000))
    const duration = 'past'
    const sort = 'start_date'
    const order = 'desc'
    const status = `${StatusEnum.PENDING},${StatusEnum.RUNNING},${StatusEnum.FINISHED}`

    
    try {
      // Explicitly check for development environment
      const isDev = process.env.NODE_ENV === 'development'
      const apiUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')
  
      // API-Aufruf an das Backend
      const backendResponse = await fetch(`${apiUrl}/api/series?from=${from}&duration=${duration}&sort=${sort}&order=${order}&status=${status}&page=${page}&size=${size}&page=${page}&size=${size}`, {
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