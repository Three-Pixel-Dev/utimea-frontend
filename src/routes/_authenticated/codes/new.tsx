import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CodeForm } from '@/features/codes/code-form'

export const Route = createFileRoute('/_authenticated/codes/new')({
  component: () => (
    <AdminFormLayout
      title='Create System Data'
      description='Add a new system data to the system.'
      cardTitle='Create New System Data'
      cardDescription='Fill in the details to create a new system data'
      backPath='/codes'
    >
      <CodeForm mode='create' />
    </AdminFormLayout>
  ),
})
