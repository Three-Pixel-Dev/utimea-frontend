import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type User = {
  id: number
  email: string
  role: {
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

export type UserRequest = {
  email: string
  password: string
  roleId: number
}

export type UserFilter = {
  email?: string
  roleId?: number
}

export const usersService = {
  getAll: async (pageAndFilter?: PageAndFilter<UserFilter>): Promise<PaginationResponse<User>> => {
    const requestBody: PageAndFilter<UserFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy,
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<User>>>(
      '/api/users/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/api/users/${id}`)
    return response.data.data as User
  },

  create: async (user: UserRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/api/users', user)
    return response.data.data as User
  },

  update: async (id: number, user: UserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${id}`, user)
    return response.data.data as User
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`)
  },
}
