import { createFileRoute, redirect } from '@tanstack/react-router'
import { StudentsWelcome } from '@/features/students/welcome'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/students/welcome')({
  path: '/students/welcome',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
      })
    }
    if (auth.user?.role.toLowerCase() !== 'student') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: StudentsWelcome,
})
