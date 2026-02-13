import { apiClient, type ApiResponse } from '@/lib/api-client'

export type DashboardCounts = {
  totalRooms: number
  totalTeachers: number
  totalStudents: number
}

export const dashboardService = {
  getCounts: async (): Promise<DashboardCounts> => {
    const response = await apiClient.get<ApiResponse<DashboardCounts>>('/api/dashboard/counts')
    return response.data.data as DashboardCounts
  },
}
