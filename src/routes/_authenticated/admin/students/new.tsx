import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { StudentForm } from '@/features/students/student-form'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/students/new')({
  path: '/admin/students/new',
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken || auth.user?.role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: () => (
    <AdminFormLayout
      title='Create Student'
      description='Add a new student to the system.'
      cardTitle='Create New Student'
      cardDescription='Fill in the details to create a new student'
      backPath='/admin/students'
    >
      <StudentForm mode='create' />
    </AdminFormLayout>
  ),
})
