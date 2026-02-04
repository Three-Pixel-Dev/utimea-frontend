import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CodeForm } from '@/features/codes/code-form'

export const Route = createFileRoute('/_authenticated/codes/new')({
  component: () => (
    <AdminFormLayout
      title='Create Code'
      description='Add a new code to the system.'
      cardTitle='Create New Code'
      cardDescription='Fill in the details to create a new code'
      backPath='/codes'
    >
      <CodeForm mode='create' />
    </AdminFormLayout>
  ),
})
