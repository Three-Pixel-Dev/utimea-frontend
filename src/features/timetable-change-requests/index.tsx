import { useQuery } from '@tanstack/react-query'
import { useState, useMemo, useCallback } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { timetableChangeRequestsService, type TimetableChangeRequestFilter } from './timetable-change-requests-service'
import { timetableChangeRequestsTableColumns } from './timetable-change-requests-table-columns'

export function TimetableChangeRequests() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [filter, setFilter] = useState<TimetableChangeRequestFilter>({
    status: 'PENDING', // Default to show only pending requests
  })

  // Serialize filter for queryKey to avoid object reference issues
  const filterKey = useMemo(() => {
    return JSON.stringify(filter)
  }, [filter])

  const { data: paginationData, isLoading, error } = useQuery({
    queryKey: ['timetable-change-requests', pagination.pageIndex, pagination.pageSize, filterKey],
    queryFn: () => timetableChangeRequestsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
      filter,
    }),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 300000, // Keep unused data in cache for 5 minutes
  })

  const requests = paginationData?.content || []

  const handleStatusChange = useCallback((value: string) => {
    const newStatus = value === 'ALL' ? undefined : (value as 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED')
    setFilter((prevFilter) => ({
      ...prevFilter,
      status: newStatus,
    }))
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageIndex: 0,
    }))
  }, [])

  return (
    <AdminTableLayout
      title='Timetable Change Requests'
      description='View and manage room and period change requests from teachers.'
      cardTitle='Change Request List'
      cardDescription='A list of all timetable change requests'
      columns={timetableChangeRequestsTableColumns}
      data={requests}
      searchKey='subject'
      searchPlaceholder='Search by subject code...'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
      headerActions={
        <div className="flex items-center gap-2">
          <Select
            value={filter.status || 'ALL'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="DECLINED">Declined</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  )
}
