import { createFileRoute, redirect } from '@tanstack/react-router'
import { Students } from '@/features/students'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/students')({
  path: '/admin/students',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Students,
})
