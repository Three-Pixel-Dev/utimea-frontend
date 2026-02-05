import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type Room = {
  id: number
  name: string
  capacity: number | null
  type: number | null
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type RoomRequest = {
  name: string
  capacity: number | null
  type: number | null
}

export type RoomFilter = {
  name?: string
  capacity?: number
  type?: number
}

export const roomsService = {
  getAll: async (pageAndFilter?: PageAndFilter<RoomFilter>): Promise<PaginationResponse<Room>> => {
    const requestBody: PageAndFilter<RoomFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy,
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Room>>>(
      '/api/rooms/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Room> => {
    const response = await apiClient.get<ApiResponse<Room>>(`/api/rooms/${id}`)
    return response.data.data as Room
  },

  create: async (room: RoomRequest): Promise<Room> => {
    const response = await apiClient.post<ApiResponse<Room>>('/api/rooms', room)
    return response.data.data as Room
  },

  update: async (id: number, room: RoomRequest): Promise<Room> => {
    const response = await apiClient.put<ApiResponse<Room>>(`/api/rooms/${id}`, room)
    return response.data.data as Room
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/rooms/${id}`)
  },
}
