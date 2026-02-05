import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { codesService } from './codes-service'
import { codesTableColumns } from './codes-table-columns'

export function Codes() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['codes', pagination.pageIndex, pagination.pageSize],
    queryFn: () => codesService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const codes = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Codes'
      description='View and manage all codes in the system.'
      cardTitle='Code List'
      cardDescription='A list of all available codes'
      columns={codesTableColumns}
      data={codes}
      searchKey='name'
      searchPlaceholder='Filter codes...'
      createPath='/codes/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
