import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { roomsService } from './rooms-service'
import { roomsTableColumns } from './rooms-table-columns'

export function Rooms() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paginationData } = useQuery({
    queryKey: ['rooms', pagination.pageIndex, pagination.pageSize],
    queryFn: () => roomsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const rooms = paginationData?.content || []

  return (
    <AdminTableLayout
      title='Rooms'
      description='View and manage all rooms in the system.'
      cardTitle='Room List'
      cardDescription='A list of all available rooms'
      columns={roomsTableColumns}
      data={rooms}
      searchKey='name'
      searchPlaceholder='Search rooms...'
      createPath='/rooms/new'
      pageCount={paginationData?.totalPages}
      totalItems={paginationData?.totalItems}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
