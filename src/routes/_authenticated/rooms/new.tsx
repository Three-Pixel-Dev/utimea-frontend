import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { RoomForm } from '@/features/rooms/room-form'

export const Route = createFileRoute('/_authenticated/rooms/new')({
  component: () => (
    <AdminFormLayout
      title='Create Room'
      description='Add a new room to the system.'
      cardTitle='Create New Room'
      cardDescription='Fill in the details to create a new room'
      backPath='/rooms'
    >
      <RoomForm mode='create' />
    </AdminFormLayout>
  ),
})
