import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Profile = {
  id: number
  name: string
  phoneNumber: string | null
  degree: string | null
  department: {
    id: number
    name: string
  } | null
  batch: {
    id: number
    name: string
  } | null
  majorSection: {
    id: number
    name: string
  } | null
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type ProfileRequest = {
  name: string
  phoneNumber: string | null
  degree: string | null
  departmentId: number | null
  batchId: number | null
  majorSectionId: number | null
}

export type ProfileFilter = {
  name?: string
  phoneNumber?: string
  degree?: string
  departmentId?: number
  batchId?: number
  majorSectionId?: number
}

export const profilesService = {
  getAll: async (pageAndFilter?: PageAndFilter<ProfileFilter>): Promise<PaginationResponse<Profile>> => {
    const requestBody: PageAndFilter<ProfileFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Profile>>>(
      '/api/profiles/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Profile> => {
    const response = await apiClient.get<ApiResponse<Profile>>(`/api/profiles/${id}`)
    return response.data.data as Profile
  },

  create: async (profile: ProfileRequest): Promise<Profile> => {
    const response = await apiClient.post<ApiResponse<Profile>>('/api/profiles', profile)
    return response.data.data as Profile
  },

  update: async (id: number, profile: ProfileRequest): Promise<Profile> => {
    const response = await apiClient.put<ApiResponse<Profile>>(`/api/profiles/${id}`, profile)
    return response.data.data as Profile
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/profiles/${id}`)
  },
}
