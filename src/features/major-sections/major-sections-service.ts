import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type MajorSection = {
  id: number
  name: string
  majorSectionYear: {
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

export type MajorSectionRequest = {
  name: string
  majorSectionYearId: number | null
}

export type MajorSectionFilter = {
  name?: string
  majorSectionYearId?: number
}

export const majorSectionsService = {
  getAll: async (pageAndFilter?: PageAndFilter<MajorSectionFilter>): Promise<PaginationResponse<MajorSection>> => {
    const requestBody: PageAndFilter<MajorSectionFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<MajorSection>>>(
      '/api/major-sections/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<MajorSection> => {
    const response = await apiClient.get<ApiResponse<MajorSection>>(`/api/major-sections/${id}`)
    return response.data.data as MajorSection
  },

  create: async (majorSection: MajorSectionRequest): Promise<MajorSection> => {
    const response = await apiClient.post<ApiResponse<MajorSection>>('/api/major-sections', majorSection)
    return response.data.data as MajorSection
  },

  update: async (id: number, majorSection: MajorSectionRequest): Promise<MajorSection> => {
    const response = await apiClient.put<ApiResponse<MajorSection>>(`/api/major-sections/${id}`, majorSection)
    return response.data.data as MajorSection
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/major-sections/${id}`)
  },
}
