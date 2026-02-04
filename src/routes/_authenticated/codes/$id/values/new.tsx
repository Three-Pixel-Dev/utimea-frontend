import { createFileRoute } from '@tanstack/react-router'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CodeValueForm } from '@/features/codes/code-value-form'

export const Route = createFileRoute('/_authenticated/codes/$id/values/new')({
  component: () => {
    const { id } = Route.useParams()
    return (
      <AdminFormLayout
        title='Add Code Value'
        description='Add a new value to this code.'
        cardTitle='Add Code Value'
        cardDescription='Fill in the details to add a new code value'
        backPath={`/codes/${id}`}
      >
        <CodeValueForm codeId={Number(id)} mode='create' />
      </AdminFormLayout>
    )
  },
})
