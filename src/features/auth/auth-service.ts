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

export type ForgotPasswordRequest = {
  email: string
}

export type VerifyOtpRequest = {
  email: string
  otp: string
}

export type ResetPasswordRequest = {
  email: string
  otp: string
  newPassword: string
}

export const authService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/login',
      request
    )
    return response.data.data
  },
  forgotPassword: async (request: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(
      '/api/auth/forgot-password',
      request
    )
  },
  verifyOtp: async (request: VerifyOtpRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(
      '/api/auth/verify-otp',
      request
    )
  },
  resetPassword: async (request: ResetPasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(
      '/api/auth/reset-password',
      request
    )
  },
}
