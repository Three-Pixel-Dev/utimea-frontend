import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Student = {
  id: number
  name: string
  phoneNumber: string | null
  email: string | null
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
  email?: string | null
  batchId?: number | null
  majorSectionId?: number | null
}

export type StudentFilter = {
  name?: string
  phoneNumber?: string
  batchId?: number
  majorSectionId?: number
}

export type ExcelImportResult = {
  successCount: number
  failureCount: number
  errors: Array<{
    rowNumber: number
    column: string
    message: string
    invalidValue?: string
  }>
}

export const studentsService = {
  getAll: async (pageAndFilter?: PageAndFilter<StudentFilter>): Promise<PaginationResponse<Student>> => {
    const requestBody: PageAndFilter<StudentFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
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

  // Excel operations
  downloadTemplate: async (): Promise<void> => {
    const response = await apiClient.get('/api/students/excel/template', {
      responseType: 'blob',
    })
    // response.data is already a Blob when responseType is 'blob'
    const url = window.URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'students_template.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  exportToExcel: async (): Promise<void> => {
    const response = await apiClient.get('/api/students/excel/export', {
      responseType: 'blob',
    })
    // response.data is already a Blob when responseType is 'blob'
    const url = window.URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  importFromExcel: async (file: File): Promise<ExcelImportResult> => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await apiClient.post<ApiResponse<ExcelImportResult>>('/api/students/excel/import', formData, {
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
      }
      
      // Handle axios errors
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.data && (errorData.data.successCount !== undefined || errorData.data.failureCount !== undefined)) {
          return errorData.data as ExcelImportResult
        }
        throw new Error(errorData.message || 'Failed to import students')
      }
      
      throw error
    }
  },
}
