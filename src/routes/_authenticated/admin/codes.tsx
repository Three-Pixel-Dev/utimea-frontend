import { createFileRoute, redirect } from '@tanstack/react-router'
import { Codes } from '@/features/codes'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/codes')({
  path: '/admin/codes',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Codes,
})
