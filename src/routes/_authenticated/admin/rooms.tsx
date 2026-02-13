import { createFileRoute, redirect } from '@tanstack/react-router'
import { Rooms } from '@/features/rooms'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/rooms')({
  path: '/admin/rooms',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Rooms,
})
