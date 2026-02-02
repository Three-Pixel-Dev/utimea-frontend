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
    // Redirect to index if accessing the layout route directly
    if (location.pathname === '/_authenticated') {
      throw redirect({
        to: '/_authenticated/',
      })
    }
  },
  component: AuthenticatedLayout,
})
