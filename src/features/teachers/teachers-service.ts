import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Teacher = {
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
}

export type TeacherRequest = {
  name: string
  phoneNumber?: string | null
  degree?: string | null
  departmentId?: number | null
}

export type TeacherFilter = {
  name?: string
  phoneNumber?: string
  degree?: string
  departmentId?: number
}

export const teachersService = {
  getAll: async (pageAndFilter?: PageAndFilter<TeacherFilter>): Promise<PaginationResponse<Teacher>> => {
    const requestBody: PageAndFilter<TeacherFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy,
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Teacher>>>(
      '/api/teachers/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Teacher> => {
    const response = await apiClient.get<ApiResponse<Teacher>>(`/api/teachers/${id}`)
    return response.data.data as Teacher
  },

  create: async (teacher: TeacherRequest): Promise<Teacher> => {
    const response = await apiClient.post<ApiResponse<Teacher>>('/api/teachers', teacher)
    return response.data.data as Teacher
  },

  update: async (id: number, teacher: TeacherRequest): Promise<Teacher> => {
    const response = await apiClient.put<ApiResponse<Teacher>>(`/api/teachers/${id}`, teacher)
    return response.data.data as Teacher
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/teachers/${id}`)
  },
}
