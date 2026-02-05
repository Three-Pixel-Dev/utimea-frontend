import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { CodeValueForm } from '@/features/codes/code-value-form'
import { codesService } from '@/features/codes/codes-service'

export const Route = createFileRoute('/_authenticated/codes/$id/values/edit/$valueId')({
  component: () => {
    const { id, valueId } = Route.useParams()
    const codeId = Number(id)
    const codeValueId = Number(valueId)

    const { data: codeValue } = useQuery({
      queryKey: ['codeValue', codeId, codeValueId],
      queryFn: () => codesService.getCodeValueById(codeValueId),
    })

    return (
      <AdminFormLayout
        title='Edit Code Value'
        description='Update code value information.'
        cardTitle='Edit Code Value'
        cardDescription='Update the code value details'
        backPath={`/codes/${id}`}
      >
        {codeValue ? (
          <CodeValueForm codeId={codeId} codeValue={codeValue} mode='edit' />
        ) : (
          <div>Loading...</div>
        )}
      </AdminFormLayout>
    )
  },
})
