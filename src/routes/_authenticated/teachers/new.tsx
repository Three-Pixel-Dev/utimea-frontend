import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { TeacherForm } from '@/features/teachers/teacher-form'

export const Route = createFileRoute('/_authenticated/teachers/new')({
  component: () => (
    <AdminFormLayout
      title='Create Teacher'
      description='Add a new teacher to the system.'
      cardTitle='Create New Teacher'
      cardDescription='Fill in the details to create a new teacher'
      backPath='/teachers'
    >
      <TeacherForm mode='create' />
    </AdminFormLayout>
  ),
})
