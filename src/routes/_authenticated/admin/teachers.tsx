import { createFileRoute, redirect } from '@tanstack/react-router'
import { Teachers } from '@/features/teachers'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/teachers')({
  path: '/admin/teachers',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Teachers,
})
