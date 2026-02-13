import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    const role = auth.user?.role.toLowerCase()
    if (role === 'admin') {
      throw redirect({
        to: '/admin/dashboard' as any,
      })
    } else if (role === 'teacher') {
      throw redirect({
        to: '/teachers/welcome' as any,
      })
    } else if (role === 'student') {
      throw redirect({
        to: '/students/welcome' as any,
      })
    }
  },
  component: () => null,
})
