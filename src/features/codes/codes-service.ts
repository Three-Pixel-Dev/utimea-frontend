import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Code = {
  id: number
  name: string
  constantValue: string
  count: number
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type CodeValue = {
  id: number
  codeId: number
  codeName?: string
  codeValue: string
  name: string // Alias for codeValue for backward compatibility
  description: string | null
  systemDefined?: boolean
  position?: number // Optional, not in backend
  active?: boolean // Optional, not in backend
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type CodeValueListResponse = {
  id: number
  codeId: number
  codeValue: string
  description: string | null
  systemDefined?: boolean
}

export type CodeRequest = {
  name: string
  constantValue: string
}

export type CodeFilter = {
  name?: string
  constantValue?: string
}

export type CodeValueRequest = {
  codeId: number
  name: string
  systemDefined?: boolean
}

export type CodeValueFilter = {
  codeId?: number
  name?: string
}

export const codesService = {
  getAll: async (pageAndFilter?: PageAndFilter<CodeFilter>): Promise<PaginationResponse<Code>> => {
    const requestBody: PageAndFilter<CodeFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Code>>>(
      '/api/codes/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Code | undefined> => {
    const response = await apiClient.get<ApiResponse<Code>>(`/api/codes/${id}`)
    return response.data.data as Code
  },

  create: async (code: CodeRequest): Promise<Code> => {
    const response = await apiClient.post<ApiResponse<Code>>('/api/codes', code)
    return response.data.data as Code
  },

  update: async (id: number, code: CodeRequest): Promise<Code> => {
    const response = await apiClient.put<ApiResponse<Code>>(`/api/codes/${id}`, code)
    return response.data.data as Code
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/codes/${id}`)
  },

  getCodeValues: async (codeId: number, pageAndFilter?: PageAndFilter<CodeValueFilter>): Promise<PaginationResponse<CodeValue>> => {
    const requestBody: PageAndFilter<CodeValueFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10, // Default to 10 rows per page
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: {
        ...pageAndFilter?.filter,
        codeId,
      },
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<CodeValue>>>(
      '/api/code-values/pageable',
      requestBody
    )
    // Map backend response to include name alias and optional fields
    const data = response.data.data
    return {
      ...data,
      content: data.content.map((cv) => ({
        ...cv,
        name: cv.codeValue, // Alias for backward compatibility
        position: 0, // Default value, not in backend
        active: true, // Default value, not in backend
      })),
    }
  },

  getCodeValuesByConstantValue: async (constantValue: string): Promise<CodeValueListResponse[]> => {
    const response = await apiClient.get<ApiResponse<CodeValueListResponse[]>>(
      `/api/code-values/constant-value/${constantValue}`
    )
    return response.data.data as CodeValueListResponse[]
  },

  getCodeValueById: async (id: number): Promise<CodeValue | undefined> => {
    const response = await apiClient.get<ApiResponse<CodeValue>>(`/api/code-values/${id}`)
    const cv = response.data.data as CodeValue
    return {
      ...cv,
      name: cv.codeValue, // Alias for backward compatibility
      position: 0, // Default value, not in backend
      active: true, // Default value, not in backend
    }
  },

  createCodeValue: async (codeId: number, value: CodeValueRequest): Promise<CodeValue> => {
    const response = await apiClient.post<ApiResponse<CodeValue>>('/api/code-values', {
      codeId,
      name: value.name,
      systemDefined: value.systemDefined ?? true,
    })
    const cv = response.data.data as CodeValue
    return {
      ...cv,
      name: cv.codeValue, // Alias for backward compatibility
      position: 0, // Default value, not in backend
      active: true, // Default value, not in backend
    }
  },

  updateCodeValue: async (id: number, value: CodeValueRequest): Promise<CodeValue> => {
    const requestBody: CodeValueRequest = {
      codeId: value.codeId,
      name: value.name,
    }
    if (value.systemDefined !== undefined) {
      requestBody.systemDefined = value.systemDefined
    }
    const response = await apiClient.put<ApiResponse<CodeValue>>(`/api/code-values/${id}`, requestBody)
    const cv = response.data.data as CodeValue
    return {
      ...cv,
      name: cv.codeValue, // Alias for backward compatibility
      position: 0, // Default value, not in backend
      active: true, // Default value, not in backend
    }
  },

  deleteCodeValue: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/code-values/${id}`)
  },
}
