import { useQuery } from '@tanstack/react-query'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { roomsService } from './rooms-service'
import { roomsTableColumns } from './rooms-table-columns'

export function Rooms() {
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsService.getAll(),
  })

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
    />
  )
}
