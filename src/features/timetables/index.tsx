import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { timetablesService } from './timetables-service'
import { timetablesTableColumns } from './timetables-table-columns'

export function Timetables() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['timetables', pagination.pageIndex, pagination.pageSize],
    queryFn: () => timetablesService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const timetables = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Timetables'
      description='View and manage all timetables in the system.'
      cardTitle='Timetable List'
      cardDescription='A list of all timetables'
      columns={timetablesTableColumns}
      data={timetables}
      searchKey='name'
      searchPlaceholder='Search timetables...'
      createPath='/timetables/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
