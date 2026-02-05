import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { TeacherForm } from '@/features/teachers/teacher-form'
import { teachersService } from '@/features/teachers/teachers-service'

export const Route = createFileRoute('/_authenticated/teachers/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: teacher } = useQuery({
      queryKey: ['teacher', id],
      queryFn: () => teachersService.getById(Number(id)),
    })

    return (
      <AdminFormLayout
        title='Edit Teacher'
        description='Update teacher information.'
        cardTitle='Edit Teacher'
        cardDescription='Update the teacher details'
        backPath='/teachers'
      >
        {teacher ? (
          <TeacherForm teacher={teacher} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
