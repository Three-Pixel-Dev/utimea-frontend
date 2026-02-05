import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CodeForm } from '@/features/codes/code-form'
import { codesService } from '@/features/codes/codes-service'

export const Route = createFileRoute('/_authenticated/codes/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: code } = useQuery({
      queryKey: ['code', id],
      queryFn: () => codesService.getById(Number(id)),
    })

    return (
      <AdminFormLayout
        title='Edit System Data'
        description='Update system data information.'
        cardTitle='Edit System Data'
        cardDescription='Update the system data details'
        backPath='/codes'
      >
        {code ? (
          <CodeForm code={code} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
