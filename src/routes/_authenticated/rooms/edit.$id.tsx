import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { RoomForm } from '@/features/rooms/room-form'
import { roomsService } from '@/features/rooms/rooms-service'

export const Route = createFileRoute('/_authenticated/rooms/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: rooms } = useQuery({
      queryKey: ['rooms'],
      queryFn: () => roomsService.getAll(),
    })

    const room = rooms?.find((r) => r.id === Number(id))

    return (
      <AdminFormLayout
        title='Edit Room'
        description='Update room information.'
        cardTitle='Edit Room'
        cardDescription='Update the room details'
        backPath='/rooms'
      >
        {room ? (
          <RoomForm room={room} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
