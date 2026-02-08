import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { SubjectForm } from '@/features/subjects/subject-form'

export const Route = createFileRoute('/_authenticated/subjects/new')({
  component: () => {
    return (
      <AdminFormLayout
        title='Create Subject'
        description='Add a new subject to the system.'
        cardTitle='Create Subject'
        cardDescription='Fill in the details to create a new subject'
        backPath='/subjects'
      >
        <SubjectForm mode='create' />
      </AdminFormLayout>
    )
  },
})
