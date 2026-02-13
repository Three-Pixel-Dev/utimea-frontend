import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { TeacherForm } from '@/features/teachers/teacher-form'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/admin/teachers/new')({
  path: '/admin/teachers/new',
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
      title='Create Teacher'
      description='Add a new teacher to the system.'
      cardTitle='Create New Teacher'
      cardDescription='Fill in the details to create a new teacher'
      backPath='/admin/teachers'
    >
      <TeacherForm mode='create' />
    </AdminFormLayout>
  ),
})
