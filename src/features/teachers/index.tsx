import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { teachersService } from './teachers-service'
import { teachersTableColumns } from './teachers-table-columns'

export function Teachers() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['teachers', pagination.pageIndex, pagination.pageSize],
    queryFn: () => teachersService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const teachers = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Teachers'
      description='View and manage all teachers in the system.'
      cardTitle='Teacher List'
      cardDescription='A list of all teachers'
      columns={teachersTableColumns}
      data={teachers}
      searchKey='name'
      searchPlaceholder='Search teachers...'
      createPath='/teachers/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
