import { createFileRoute, redirect } from '@tanstack/react-router'
import { MajorSections } from '@/features/major-sections'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/major-sections')({
  path: '/admin/major-sections',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: MajorSections,
})
