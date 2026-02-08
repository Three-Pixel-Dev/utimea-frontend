import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { SubjectForm } from '@/features/subjects/subject-form'
import { subjectsService } from '@/features/subjects/subjects-service'

export const Route = createFileRoute('/_authenticated/subjects/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: subject } = useQuery({
      queryKey: ['subject', id],
      queryFn: () => subjectsService.getById(Number(id)),
    })

    return (
      <AdminFormLayout
        title='Edit Subject'
        description='Update subject information.'
        cardTitle='Edit Subject'
        cardDescription='Update the subject details'
        backPath='/subjects'
      >
        {subject ? (
          <SubjectForm subject={subject} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
