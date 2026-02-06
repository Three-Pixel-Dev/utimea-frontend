import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Allow 206 Partial Content responses through (used for Excel import with errors)
    if (response.status === 206) {
      return response
    }
    return response
  },
  (error) => {
    // Handle 206 Partial Content in error handler as well (axios might treat it as error)
    if (error.response?.status === 206) {
      return Promise.resolve(error.response)
    }
    if (error.response?.status === 401) {
      useAuthStore.getState().auth.reset()
    }
    return Promise.reject(error)
  }
)

export type ApiResponse<T> = {
  success: number
  code: number
  meta: {
    endpoint: string
    method: string
    totalItems: number
    totalPages: number
    currentPage: number
  }
  data: T
  message: string
}

export type PaginationResponse<T> = {
  content: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export type PageAndFilter<T> = {
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
  filter?: T
}
