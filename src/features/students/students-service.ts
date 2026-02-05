import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Student = {
  id: number
  name: string
  phoneNumber: string | null
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

export type StudentRequest = {
  name: string
  phoneNumber?: string | null
  batchId?: number | null
  majorSectionId?: number | null
}

export type StudentFilter = {
  name?: string
  phoneNumber?: string
  batchId?: number
  majorSectionId?: number
}

export const studentsService = {
  getAll: async (pageAndFilter?: PageAndFilter<StudentFilter>): Promise<PaginationResponse<Student>> => {
    const requestBody: PageAndFilter<StudentFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy,
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Student>>>(
      '/api/students/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Student> => {
    const response = await apiClient.get<ApiResponse<Student>>(`/api/students/${id}`)
    return response.data.data as Student
  },

  create: async (student: StudentRequest): Promise<Student> => {
    const response = await apiClient.post<ApiResponse<Student>>('/api/students', student)
    return response.data.data as Student
  },

  update: async (id: number, student: StudentRequest): Promise<Student> => {
    const response = await apiClient.put<ApiResponse<Student>>(`/api/students/${id}`, student)
    return response.data.data as Student
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/students/${id}`)
  },
}
