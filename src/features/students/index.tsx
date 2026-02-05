import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { studentsService } from './students-service'
import { studentsTableColumns } from './students-table-columns'

export function Students() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['students', pagination.pageIndex, pagination.pageSize],
    queryFn: () => studentsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const students = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Students'
      description='View and manage all students in the system.'
      cardTitle='Student List'
      cardDescription='A list of all students'
      columns={studentsTableColumns}
      data={students}
      searchKey='name'
      searchPlaceholder='Search students...'
      createPath='/students/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
