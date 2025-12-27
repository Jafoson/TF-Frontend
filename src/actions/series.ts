'use server'

import { ResponseError, Response } from "@/types/response"
import { BulkSeriesParams, SeriesDTO } from "@/types/series"
import { PaginationResponseDTO } from "@/types/pagination"
import { FilterItem, FilterRequestDTO } from "@/types/filter"
import { apiFetchData } from "@/utils/api"

export async function getSeries(params: BulkSeriesParams = {}): Promise<Response<PaginationResponseDTO<SeriesDTO>> | ResponseError> {


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
    
  const response = await apiFetchData<PaginationResponseDTO<SeriesDTO>>(`/api/series${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
    method: 'GET',
    requireAuth: false,
      })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<SeriesDTO>>
}

  export async function getAllFormats(params: FilterRequestDTO = {}): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {
    const searchParams = new URLSearchParams()
  
        if (params.page !== undefined) searchParams.append('page', params.page.toString())
        if (params.size !== undefined) searchParams.append('size', params.size.toString())
        if (params.search !== undefined) searchParams.append('search', params.search.toString())
  
    const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/series/formats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      requireAuth: false,
      })

  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}
 
  export async function getAllStatus(params: FilterRequestDTO = {}): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {
    const searchParams = new URLSearchParams()
  
        if (params.page !== undefined) searchParams.append('page', params.page.toString())
        if (params.size !== undefined) searchParams.append('size', params.size.toString())
        if (params.search !== undefined) searchParams.append('search', params.search.toString())
  
    const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/series/status${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      requireAuth: false,
      })
  
  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}
