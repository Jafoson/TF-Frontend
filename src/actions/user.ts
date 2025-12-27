'use server'

import { UserResponseDTO } from '@/types/user'
import { Response, ResponseError } from '@/types/response'
import { apiFetchData } from '@/utils/api'

export async function getMyUser(): Promise<Response<UserResponseDTO> | ResponseError> { 
    const response = await apiFetchData<UserResponseDTO>('/api/user', {
        method: 'GET',
        skipRedirect: true,
    })

    return response as Response<UserResponseDTO> | ResponseError
}