import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { TimetableForm } from '@/features/timetables/timetable-form'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/timetables/new')({
  path: '/admin/timetables/new',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: () => {
    return (
      <AdminFormLayout
        title='Create Timetable'
        description='Add a new timetable entry.'
        cardTitle='Create Timetable'
        cardDescription='Fill in the details to create a new timetable entry'
        backPath='/admin/timetables'
      >
        <TimetableForm mode='create' />
      </AdminFormLayout>
    )
  },
})
