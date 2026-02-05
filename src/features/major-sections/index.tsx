import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { majorSectionsService } from './major-sections-service'
import { majorSectionsTableColumns } from './major-sections-table-columns'

export function MajorSections() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['majorSections', pagination.pageIndex, pagination.pageSize],
    queryFn: () => majorSectionsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const majorSections = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Major Sections'
      description='View and manage all major sections in the system.'
      cardTitle='Major Section List'
      cardDescription='A list of all available major sections'
      columns={majorSectionsTableColumns}
      data={majorSections}
      searchKey='name'
      searchPlaceholder='Search major sections...'
      createPath='/major-sections/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
