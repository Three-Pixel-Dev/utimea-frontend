import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { TimetableForm } from '@/features/timetables/timetable-form'
import { timetablesService } from '@/features/timetables/timetables-service'

export const Route = createFileRoute('/_authenticated/timetables/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: timetable } = useQuery({
      queryKey: ['timetable', id],
      queryFn: () => timetablesService.getById(Number(id)),
    })

    return (
      <AdminFormLayout
        title='Edit Timetable'
        description='Update timetable information.'
        cardTitle='Edit Timetable'
        cardDescription='Update the timetable details'
        backPath='/timetables'
      >
        {timetable ? (
          <TimetableForm timetable={timetable} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
