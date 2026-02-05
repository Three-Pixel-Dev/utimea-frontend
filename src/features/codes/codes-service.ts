import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Code = {
  id: number
  name: string
  constantValue: string
  systemDefined: boolean // Frontend-only field, defaults to false
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
      sortBy: pageAndFilter?.sortBy,
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Code>>>(
      '/api/codes/pageable',
      requestBody
    )
    // Map backend response to include systemDefined field (defaults to false)
    const data = response.data.data
    return {
      ...data,
      content: data.content.map((code) => ({
        ...code,
        systemDefined: false, // Can be enhanced later with logic based on constantValue
      })),
    }
  },

  getById: async (id: number): Promise<Code | undefined> => {
    const response = await apiClient.get<ApiResponse<Code>>(`/api/codes/${id}`)
    const code = response.data.data as Code
    return {
      ...code,
      systemDefined: false,
    }
  },

  create: async (code: CodeRequest): Promise<Code> => {
    const response = await apiClient.post<ApiResponse<Code>>('/api/codes', code)
    const createdCode = response.data.data as Code
    return {
      ...createdCode,
      systemDefined: false,
    }
  },

  update: async (id: number, code: CodeRequest): Promise<Code> => {
    const response = await apiClient.put<ApiResponse<Code>>(`/api/codes/${id}`, code)
    const updatedCode = response.data.data as Code
    return {
      ...updatedCode,
      systemDefined: false,
    }
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/codes/${id}`)
  },

  getCodeValues: async (codeId: number, pageAndFilter?: PageAndFilter<CodeValueFilter>): Promise<PaginationResponse<CodeValue>> => {
    const requestBody: PageAndFilter<CodeValueFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10, // Default to 10 rows per page
      sortBy: pageAndFilter?.sortBy,
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
    const response = await apiClient.put<ApiResponse<CodeValue>>(`/api/code-values/${id}`, value)
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
