import { apiClient, type ApiResponse, type PaginationResponse, type PageAndFilter } from '@/lib/api-client'

export type TimetableInfo = {
  id: number
  name: string
  majorSection: {
    id: number
    name: string
  }
  academicYear: {
    id: number
    name: string
  }
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type TimetableInfoWithTimetables = TimetableInfo & {
  timetables: Timetable[]
}

export type Timetable = {
  id: number
  name: string
  timetableInfo: {
    id: number
    name: string
    majorSection: {
      id: number
      name: string
    }
    academicYear: {
      id: number
      name: string
    }
  }
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
    }
    room: {
      id: number
      name: string
      capacity: number | null
    }
  }
  masterData: {
    id: number
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
  }
}

export type TimetableRequest = {
  majorSectionId: number
  academicYearId: number
  timetableDayId: number
  timetablePeriodId: number
  subjectId: number
  roomId: number
}

export type TimetableFilter = {
  majorSectionId?: number
  academicYearId?: number
  timetableDayId?: number
  timetablePeriodId?: number
  subjectId?: number
  roomId?: number
}

export type TimetableInfoFilter = {
  majorSectionId?: number
  academicYearId?: number
}

export const timetablesService = {
  getAllInfo: async (pageAndFilter?: PageAndFilter<TimetableInfoFilter>): Promise<PaginationResponse<TimetableInfo>> => {
    const requestBody: PageAndFilter<TimetableInfoFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<TimetableInfo>>>(
      '/api/timetables/info/pageable',
      requestBody
    )
    return response.data.data
  },

  getInfoById: async (id: number): Promise<TimetableInfoWithTimetables> => {
    const response = await apiClient.get<ApiResponse<TimetableInfoWithTimetables>>(`/api/timetables/info/${id}`)
    return response.data.data as TimetableInfoWithTimetables
  },

  createInfo: async (timetableInfo: { majorSectionId: number; academicYearId: number }): Promise<TimetableInfo> => {
    const response = await apiClient.post<ApiResponse<TimetableInfo>>('/api/timetables/info', timetableInfo)
    return response.data.data as TimetableInfo
  },

  getAll: async (pageAndFilter?: PageAndFilter<TimetableFilter>): Promise<PaginationResponse<Timetable>> => {
    const requestBody: PageAndFilter<TimetableFilter> = {
      page: pageAndFilter?.page ?? 0,
      size: pageAndFilter?.size ?? 10,
      sortBy: pageAndFilter?.sortBy ?? 'id',
      sortDirection: pageAndFilter?.sortDirection ?? 'ASC',
      filter: pageAndFilter?.filter,
    }
    const response = await apiClient.post<ApiResponse<PaginationResponse<Timetable>>>(
      '/api/timetables/pageable',
      requestBody
    )
    return response.data.data
  },

  getById: async (id: number): Promise<Timetable> => {
    const response = await apiClient.get<ApiResponse<Timetable>>(`/api/timetables/${id}`)
    return response.data.data as Timetable
  },

  create: async (timetable: TimetableRequest): Promise<Timetable> => {
    const response = await apiClient.post<ApiResponse<Timetable>>('/api/timetables', timetable)
    return response.data.data as Timetable
  },

  update: async (id: number, timetable: TimetableRequest): Promise<Timetable> => {
    const response = await apiClient.put<ApiResponse<Timetable>>(`/api/timetables/${id}`, timetable)
    return response.data.data as Timetable
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/timetables/${id}`)
  },
}
