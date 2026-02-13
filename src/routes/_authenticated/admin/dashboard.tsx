import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/dashboard')({
  path: '/admin/dashboard',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
      })
    }
    if (auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Dashboard,
})
