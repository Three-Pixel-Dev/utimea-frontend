import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { RoomForm } from '@/features/rooms/room-form'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/rooms/new')({
  path: '/admin/rooms/new',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: () => (
    <AdminFormLayout
      title='Create Room'
      description='Add a new room to the system.'
      cardTitle='Create New Room'
      cardDescription='Fill in the details to create a new room'
      backPath='/admin/rooms'
    >
      <RoomForm mode='create' />
    </AdminFormLayout>
  ),
})
