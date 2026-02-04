import { useQuery } from '@tanstack/react-query'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { teachersService } from './teachers-service'
import { teachersTableColumns } from './teachers-table-columns'

export function Teachers() {
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersService.getAll(),
  })

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
    />
  )
}
