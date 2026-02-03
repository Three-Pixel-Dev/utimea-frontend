import { useQuery } from '@tanstack/react-query'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { tablesService } from './tables-service'
import { tablesTableColumns } from './tables-table-columns'

export function Tables() {
  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesService.getAll(),
  })

  return (
    <AdminTableLayout
      title='Tables'
      description='View and manage all tables in the system.'
      cardTitle='Table List'
      cardDescription='A list of all available tables'
      columns={tablesTableColumns}
      data={tables}
      searchKey='name'
      searchPlaceholder='Search tables...'
    />
  )
}
