'use server'

import { FilterItem, FilterRequestDTO } from "@/types/filter"
import { PaginationResponseDTO } from "@/types/pagination"
import { ResponseError, Response } from "@/types/response"
import { BulkTeamsParams, TeamBulkDTO } from "@/types/teams"
import { apiFetchData } from "@/utils/api"

export async function getTeams(params: BulkTeamsParams = {}): Promise<Response<TeamBulkDTO[]> | ResponseError> {


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

    const response = await apiFetchData<TeamBulkDTO[]>(`/api/teams/bulk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      requireAuth: false,
        })
    
  if (!response.success) {
    return response as ResponseError
  }

  return response as Response<TeamBulkDTO[]>
}
  
export async function getAllFoundingYears(params: FilterRequestDTO = {}): Promise<Response<PaginationResponseDTO<FilterItem[]>> | ResponseError> {
    const searchParams = new URLSearchParams()

      if (params.page !== undefined) searchParams.append('page', params.page.toString())
      if (params.size !== undefined) searchParams.append('size', params.size.toString())
      if (params.search !== undefined) searchParams.append('search', params.search.toString())

    const response = await apiFetchData<PaginationResponseDTO<FilterItem[]>>(`/api/teams/founding/filter${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      requireAuth: false,
    })

    if (!response.success) {
      return response as ResponseError
    }

  return response as Response<PaginationResponseDTO<FilterItem[]>>
}