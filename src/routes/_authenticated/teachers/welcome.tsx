import { createFileRoute, redirect } from '@tanstack/react-router'
import { TeachersWelcome } from '@/features/teachers/welcome'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/teachers/welcome')({
  path: '/teachers/welcome',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
      })
    }
    if (auth.user?.role.toLowerCase() !== 'teacher') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: TeachersWelcome,
})
