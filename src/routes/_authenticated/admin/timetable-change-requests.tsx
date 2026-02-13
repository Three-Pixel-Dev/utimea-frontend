import { createFileRoute, redirect } from '@tanstack/react-router'
import { TimetableChangeRequests } from '@/features/timetable-change-requests'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/timetable-change-requests')({
  path: '/admin/timetable-change-requests',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: TimetableChangeRequests,
})
