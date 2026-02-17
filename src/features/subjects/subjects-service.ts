import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Subject = {
  id: number
  code: string
  description: string | null
  subjectTypes: {
    id: number
    name: string
  }[] | null
  roomType: {
    id: number
    name: string
  } | null
  teachers: {
    id: number
    name: string
    phoneNumber: string | null
    degree: string | null
    department: {
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
  }[] | null
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
  subjectTypeIds: number[] | null
  roomTypeId: number | null
  teacherIds: number[] | null
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

  deleteMany: async (ids: number[]): Promise<void> => {
    await apiClient.post('/api/subjects/bulk-delete', { ids })
  },
}
