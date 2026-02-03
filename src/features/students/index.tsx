import { useQuery } from '@tanstack/react-query'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { studentsService } from './students-service'
import { studentsTableColumns } from './students-table-columns'

export function Students() {
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsService.getAll(),
  })

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
    />
  )
}
