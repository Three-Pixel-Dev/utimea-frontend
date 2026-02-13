import { createFileRoute, redirect } from '@tanstack/react-router'
import { Subjects } from '@/features/subjects'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/subjects')({
  path: '/admin/subjects',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Subjects,
})
