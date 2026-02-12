import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CombineClassForm } from '@/features/timetables/combine-class-form'

export const Route = createFileRoute('/_authenticated/timetables/combine')({
  component: () => {
    return (
      <AdminFormLayout
        title='Combine Class'
        description='Select sections, subject, and periods to combine into a single class.'
        cardTitle='Combine Class'
        cardDescription='Select sections, subject, and periods to combine into a single class'
        backPath='/timetables'
      >
        <CombineClassForm />
      </AdminFormLayout>
    )
  },
})
