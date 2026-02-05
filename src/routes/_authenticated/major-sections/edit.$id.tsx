import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { MajorSectionForm } from '@/features/major-sections/major-section-form'
import { majorSectionsService } from '@/features/major-sections/major-sections-service'

export const Route = createFileRoute('/_authenticated/major-sections/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: majorSection } = useQuery({
      queryKey: ['majorSection', id],
      queryFn: () => majorSectionsService.getById(Number(id)),
    })

    return (
      <AdminFormLayout
        title='Edit Major Section'
        description='Update major section information.'
        cardTitle='Edit Major Section'
        cardDescription='Update the major section details'
        backPath='/major-sections'
      >
        {majorSection ? (
          <MajorSectionForm majorSection={majorSection} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
