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

export type ExcelImportResult = {
  successCount: number
  failureCount: number
  totalCount: number
  errors: Array<{
    rowNumber: number
    column?: string
    message: string
    invalidValue?: string
  }>
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

  // Excel operations
  downloadTemplate: async (): Promise<void> => {
    const response = await apiClient.get('/api/teachers/excel/template', {
      responseType: 'blob',
    })
    // response.data is already a Blob when responseType is 'blob'
    const url = window.URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'teachers_template.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  exportToExcel: async (): Promise<void> => {
    const response = await apiClient.get('/api/teachers/excel/export', {
      responseType: 'blob',
    })
    // response.data is already a Blob when responseType is 'blob'
    const url = window.URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `teachers_export_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  importFromExcel: async (file: File): Promise<ExcelImportResult> => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await apiClient.post<ApiResponse<ExcelImportResult>>('/api/teachers/excel/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Log for debugging (remove in production if needed)
      if (import.meta.env.DEV) {
        console.log('Import response:', response)
      }
      
      // Check if response and data exist
      if (response?.data?.data) {
        return response.data.data
      }
      
      // If response.data exists but doesn't have nested data, check if it's the result directly
      if (response?.data) {
        const responseData = response.data as any
        // Check if it has the ExcelImportResult structure
        if (responseData.successCount !== undefined || responseData.failureCount !== undefined) {
          return responseData as ExcelImportResult
        }
        // Try nested data
        if (responseData.data) {
          return responseData.data as ExcelImportResult
        }
      }
      
      throw new Error('Invalid response structure: ' + JSON.stringify(response?.data))
    } catch (error: any) {
      // Log for debugging
      if (import.meta.env.DEV) {
        console.error('Import error:', error)
        console.error('Error response:', error.response)
      }
      
      // Handle 206 Partial Content and other error responses
      if (error.response?.data?.data) {
        return error.response.data.data as ExcelImportResult
      }
      
      // Check if error response has data directly
      if (error.response?.data && typeof error.response.data === 'object') {
        const errorData = error.response.data as any
        // Check if it's already the ExcelImportResult structure
        if (errorData.successCount !== undefined || errorData.failureCount !== undefined) {
          return errorData as ExcelImportResult
        }
        // Try to get data from nested structure
        if (errorData.data) {
          return errorData.data as ExcelImportResult
        }
      }
      
      // If no data in error response, throw the error
      throw error
    }
  },
}
