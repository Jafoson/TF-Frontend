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
import { uuidSchema } from "@/schemas/general";
import { apiFetchData } from "@/utils/api";

export async function getGamesBatch(gameIds: string[]): Promise<Response<GameDTO[]> | ResponseError> {
  const validatedData = uuidSchema.array().safeParse(gameIds)

  if (!validatedData.success) {
    return {  
      code: 'VALIDATION_ERROR',
      errors: validatedData.error.errors.map((error) => ({
        field: error.path.join('.'),
        code: error.message as string,
      })),
      success: false,
    } as ResponseError
  }

  const body: GameBatchRequest = {
    gameIds: validatedData.data,
  }

  const response = await apiFetchData<GameDTO[]>('/api/game/batch', {
    method: 'POST',
    body: JSON.stringify(body)
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<GameDTO[]>
}

export async function getAllGenres(params: FilterRequestDTO): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

  const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/game/genre${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
    method: 'GET',
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}

export async function getAllPlatforms(params: FilterRequestDTO): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

  const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/game/platform${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
    method: 'GET',
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}

export async function getAllAgeRatings(params: FilterRequestDTO): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

  const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/game/age${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
    method: 'GET',
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}

export async function getAllDevelopers(params: FilterRequestDTO): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {

      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())



  const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/game/developer${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}

export async function getAllPublishYears(params: FilterRequestDTO): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {
      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

  const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/game/publishyear${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}

export async function getAllGames(params: FilterRequestDTO): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {
      const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

  const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/game/all${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
    requireAuth: false,
  })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}

export async function getBulkGames(params: BulkGamesParams = {}): Promise<Response<PaginationResponseDTO<BulkGameDTO>> | ResponseError> {
  const searchParams = new URLSearchParams()
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
    
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
    
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection)

    const url = `/api/game/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    const response = await apiFetchData<PaginationResponseDTO<BulkGameDTO>>(url, {
      method: 'GET',
      requireAuth: false,
    })

    if (!response.success) {
      return response as ResponseError
    } 

    return response as Response<PaginationResponseDTO<BulkGameDTO>>
}
