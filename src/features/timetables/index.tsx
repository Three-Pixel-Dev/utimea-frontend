import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { Button } from '@/components/ui/button'
import { timetablesService } from './timetables-service'
import { timetablesTableColumns } from './timetables-table-columns'
import { GenerateTimetableDialog } from './generate-timetable-dialog'

export function Timetables() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const navigate = useNavigate()

  const { data: paginationData } = useQuery({
    queryKey: ['timetable-infos', pagination.pageIndex, pagination.pageSize],
    queryFn: () => timetablesService.getAllInfo({
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
      headerActions={
        <div className="flex items-center gap-2">
          <GenerateTimetableDialog />
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate({ to: '/timetables/combine' as any })}
          >
            <Users className='mr-2 h-4 w-4' />
            Combine Class
          </Button>
        </div>
      }
    />
  )
}
