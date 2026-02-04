import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { MajorSectionForm } from '@/features/major-sections/major-section-form'

export const Route = createFileRoute('/_authenticated/major-sections/new')({
  component: () => (
    <AdminFormLayout
      title='Create Major Section'
      description='Add a new major section to the system.'
      cardTitle='Create New Major Section'
      cardDescription='Fill in the details to create a new major section'
      backPath='/major-sections'
    >
      <MajorSectionForm mode='create' />
    </AdminFormLayout>
  ),
})
