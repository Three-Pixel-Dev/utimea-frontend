import { createFileRoute, redirect } from '@tanstack/react-router'
import { Timetables } from '@/features/timetables'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/timetables')({
  path: '/admin/timetables',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Timetables,
})
