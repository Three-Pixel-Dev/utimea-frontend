import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CodeForm } from '@/features/codes/code-form'
import { codesService } from '@/features/codes/codes-service'

export const Route = createFileRoute('/_authenticated/codes/edit/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { data: codes } = useQuery({
      queryKey: ['codes'],
      queryFn: () => codesService.getAll(),
    })

    const code = codes?.find((c) => c.id === Number(id))

    return (
      <AdminFormLayout
        title='Edit Code'
        description='Update code information.'
        cardTitle='Edit Code'
        cardDescription='Update the code details'
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
