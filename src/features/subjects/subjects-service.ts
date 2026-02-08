import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Subject = {
  id: number
  code: string
  description: string | null
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type SubjectRequest = {
  code: string
  description: string | null
}

export type SubjectFilter = {
  code?: string
  description?: string
}

export const subjectsService = {
  getAll: async (pageAndFilter?: PageAndFilter<SubjectFilter>): Promise<PaginationResponse<Subject>> => {
    const requestBody: PageAndFilter<SubjectFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Subject>>>(
      '/api/subjects/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Subject> => {
    const response = await apiClient.get<ApiResponse<Subject>>(`/api/subjects/${id}`)
    return response.data.data as Subject
  },

  create: async (subject: SubjectRequest): Promise<Subject> => {
    const response = await apiClient.post<ApiResponse<Subject>>('/api/subjects', subject)
    return response.data.data as Subject
  },

  update: async (id: number, subject: SubjectRequest): Promise<Subject> => {
    const response = await apiClient.put<ApiResponse<Subject>>(`/api/subjects/${id}`, subject)
    return response.data.data as Subject
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/subjects/${id}`)
  },
}
