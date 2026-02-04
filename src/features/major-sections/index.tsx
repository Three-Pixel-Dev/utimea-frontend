import { useQuery } from '@tanstack/react-query'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { majorSectionsService } from './major-sections-service'
import { majorSectionsTableColumns } from './major-sections-table-columns'

export function MajorSections() {
  const { data: majorSections = [] } = useQuery({
    queryKey: ['majorSections'],
    queryFn: () => majorSectionsService.getAll(),
  })

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
    />
  )
}
