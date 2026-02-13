import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
    
    // Role-based redirect for root authenticated route
    if (location.pathname === '/_authenticated' || location.pathname === '/_authenticated/') {
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
    }
  },
  component: AuthenticatedLayout,
})
