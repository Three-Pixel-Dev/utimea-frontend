import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Role = {
  id: number
  name: string
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type RoleRequest = {
  name: string
}

export type RoleFilter = {
  name?: string
}

export const rolesService = {
  getAll: async (pageAndFilter?: PageAndFilter<RoleFilter>): Promise<PaginationResponse<Role>> => {
    const requestBody: PageAndFilter<RoleFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Role>>>(
      '/api/roles/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Role> => {
    const response = await apiClient.get<ApiResponse<Role>>(`/api/roles/${id}`)
    return response.data.data as Role
  },

  create: async (role: RoleRequest): Promise<Role> => {
    const response = await apiClient.post<ApiResponse<Role>>('/api/roles', role)
    return response.data.data as Role
  },

  update: async (id: number, role: RoleRequest): Promise<Role> => {
    const response = await apiClient.put<ApiResponse<Role>>(`/api/roles/${id}`, role)
    return response.data.data as Role
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/roles/${id}`)
  },
}
