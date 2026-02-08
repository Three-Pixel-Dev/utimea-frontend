import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { TimetableForm } from '@/features/timetables/timetable-form'

export const Route = createFileRoute('/_authenticated/timetables/new')({
  component: () => {
    return (
      <AdminFormLayout
        title='Create Timetable'
        description='Add a new timetable entry.'
        cardTitle='Create Timetable'
        cardDescription='Fill in the details to create a new timetable entry'
        backPath='/timetables'
      >
        <TimetableForm mode='create' />
      </AdminFormLayout>
    )
  },
})
