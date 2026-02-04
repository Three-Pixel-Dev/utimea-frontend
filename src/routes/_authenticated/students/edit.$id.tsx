import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { StudentForm } from '@/features/students/student-form'
import { studentsService } from '@/features/students/students-service'

export const Route = createFileRoute('/_authenticated/students/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: students } = useQuery({
      queryKey: ['students'],
      queryFn: () => studentsService.getAll(),
    })

    const student = students?.find((s) => s.id === Number(id))

    return (
      <AdminFormLayout
        title='Edit Student'
        description='Update student information.'
        cardTitle='Edit Student'
        cardDescription='Update the student details'
        backPath='/students'
      >
        {student ? (
          <StudentForm student={student} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
