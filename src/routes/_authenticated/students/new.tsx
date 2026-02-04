import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { StudentForm } from '@/features/students/student-form'

export const Route = createFileRoute('/_authenticated/students/new')({
  component: () => (
    <AdminFormLayout
      title='Create Student'
      description='Add a new student to the system.'
      cardTitle='Create New Student'
      cardDescription='Fill in the details to create a new student'
      backPath='/students'
    >
      <StudentForm mode='create' />
    </AdminFormLayout>
  ),
})
