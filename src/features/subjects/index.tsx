import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { subjectsService } from './subjects-service'
import { subjectsTableColumns } from './subjects-table-columns'

export function Subjects() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['subjects', pagination.pageIndex, pagination.pageSize],
    queryFn: () => subjectsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const subjects = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Subjects'
      description='View and manage all subjects in the system.'
      cardTitle='Subject List'
      cardDescription='A list of all subjects'
      columns={subjectsTableColumns}
      data={subjects}
      searchKey='code'
      searchPlaceholder='Search subjects...'
      createPath='/subjects/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
