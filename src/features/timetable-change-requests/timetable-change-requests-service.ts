import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type TimetableChangeRequest = {
  id: number
  timetableData: {
    id: number
    timetableDay: {
      id: number
      name: string
    }
    timetablePeriod: {
      id: number
      name: string
    }
    subject: {
      id: number
      code: string
      description: string | null
      teachers: {
        id: number
        name: string
        phoneNumber: string | null
        degree: string | null
      }[] | null
    }
    room: {
      id: number
      name: string
      capacity: number | null
    }
    subjectType: string | null
    teacher: {
      id: number
      name: string
      phoneNumber: string | null
      degree: string | null
    } | null
  }
  requestType: 'ROOM_CHANGE' | 'PERIOD_CHANGE'
  requestScope: 'SPECIFIC_DATE' | 'PERMANENT'
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED'
  newRoom: {
    id: number
    name: string
    capacity: number | null
  } | null
  newTimetableDay: {
    id: number
    name: string
  } | null
  newTimetablePeriod: {
    id: number
    name: string
  } | null
  specificDate: string | null
  requestedBy: {
    id: number
    name: string
    phoneNumber: string | null
    degree: string | null
  }
  processedBy: {
    id: number
    email: string
  } | null
  processedAt: string | null
  requestReason: string | null
  adminComment: string | null
  requestedAt: string
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type PeriodChangeRequest = {
  timetableDataId: number
  newTimetableDayId: number
  newTimetablePeriodId: number
  requestScope: 'SPECIFIC_DATE' | 'PERMANENT'
  specificDate?: string | null
  requestReason?: string | null
}

export type RoomChangeRequest = {
  timetableDataId: number
  newRoomId: number
  requestScope: 'SPECIFIC_DATE' | 'PERMANENT'
  specificDate?: string | null
  requestReason?: string | null
}

export type ProcessChangeRequest = {
  requestId: number
  action: 'APPROVE' | 'DECLINE'
  adminComment?: string | null
}

export type TimetableChangeRequestFilter = {
  timetableDataId?: number
  requestedById?: number
  requestType?: 'ROOM_CHANGE' | 'PERIOD_CHANGE'
  status?: 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED'
  processedById?: number
}

export const timetableChangeRequestsService = {
  getAll: async (pageAndFilter?: PageAndFilter<TimetableChangeRequestFilter>): Promise<PaginationResponse<TimetableChangeRequest>> => {
    const requestBody: PageAndFilter<TimetableChangeRequestFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'requestedAt',
      sortDirection: pageAndFilter?.sortDirection ?? 'DESC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<TimetableChangeRequest>>>(
      '/api/timetable-change-requests/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<TimetableChangeRequest> => {
    const response = await apiClient.get<ApiResponse<TimetableChangeRequest>>(`/api/timetable-change-requests/${id}`)
    return response.data.data as TimetableChangeRequest
  },

  requestPeriodChange: async (request: PeriodChangeRequest): Promise<TimetableChangeRequest> => {
    const response = await apiClient.post<ApiResponse<TimetableChangeRequest>>(
      '/api/timetable-change-requests/period-change',
      request
    )
    return response.data.data as TimetableChangeRequest
  },

  requestRoomChange: async (request: RoomChangeRequest): Promise<TimetableChangeRequest> => {
    const response = await apiClient.post<ApiResponse<TimetableChangeRequest>>(
      '/api/timetable-change-requests/room-change',
      request
    )
    return response.data.data as TimetableChangeRequest
  },

  processRequest: async (request: ProcessChangeRequest): Promise<TimetableChangeRequest> => {
    const response = await apiClient.post<ApiResponse<TimetableChangeRequest>>(
      '/api/timetable-change-requests/process',
      request
    )
    return response.data.data as TimetableChangeRequest
  },

  getByTeacherId: async (teacherId: number): Promise<TimetableChangeRequest[]> => {
    const response = await apiClient.get<ApiResponse<TimetableChangeRequest[]>>(
      `/api/timetable-change-requests/teacher/${teacherId}`
    )
    return response.data.data as TimetableChangeRequest[]
  },
}
