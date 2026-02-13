import { apiClient, type ApiResponse } from '@/lib/api-client'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  email: string
  role: string
  userId: number
}

export const authService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/login',
      request
    )
    return response.data.data
  },
}
