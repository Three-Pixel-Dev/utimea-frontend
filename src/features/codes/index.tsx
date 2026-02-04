import { useQuery } from '@tanstack/react-query'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { codesService } from './codes-service'
import { codesTableColumns } from './codes-table-columns'

export function Codes() {
  const { data: codes = [] } = useQuery({
    queryKey: ['codes'],
    queryFn: () => codesService.getAll(),
  })

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
    />
  )
}
