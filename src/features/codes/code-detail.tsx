import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { AdminLayout } from '@/components/layout/admin-layout'
import { codesService, CodeValue } from './codes-service'
import { createCodeValuesTableColumns } from './code-values-table-columns'

type CodeDetailProps = {
  codeId: number
}

export function CodeDetail({ codeId }: CodeDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: code } = useQuery({
    queryKey: ['code', codeId],
    queryFn: () => codesService.getById(codeId),
  })

  const { data: codeValues = [] } = useQuery({
    queryKey: ['codeValues', codeId],
    queryFn: () => codesService.getCodeValues(codeId),
  })

  const handleEditCode = () => {
    navigate({ to: `/codes/edit/${codeId}` as any })
  }

  const handleDeleteCode = () => {
    if (!confirm('Are you sure you want to delete this code? This will also delete all code values.')) {
      return
    }

    toast.promise(
      codesService.delete(codeId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['codes'] })
        navigate({ to: '/codes' as any })
      }),
      {
        loading: 'Deleting code...',
        success: 'Code deleted successfully!',
        error: 'Failed to delete code',
      }
    )
  }

  const handleAddCodeValue = () => {
    navigate({ to: `/codes/${codeId}/values/new` as any })
  }

  const handleEditCodeValue = (value: CodeValue) => {
    navigate({ to: `/codes/${codeId}/values/edit/${value.id}` as any })
  }

  const handleDeleteCodeValue = (valueId: number) => {
    if (!confirm('Are you sure you want to delete this code value?')) {
      return
    }

    toast.promise(
      codesService.deleteCodeValue(codeId, valueId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['codeValues', codeId] })
      }),
      {
        loading: 'Deleting code value...',
        success: 'Code value deleted successfully!',
        error: 'Failed to delete code value',
      }
    )
  }

  if (!code) {
    return <div>Loading...</div>
  }

  const columns = createCodeValuesTableColumns({
    onEdit: handleEditCodeValue,
    onDelete: handleDeleteCodeValue,
  })

  return (
    <AdminLayout
      title={code.name}
      description='Manage code values for this code'
    >
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-2xl font-bold'>{code.name}</CardTitle>
              <CardDescription>Code values management</CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={handleAddCodeValue}
                size='sm'
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Code Value
              </Button>
              <Button
                onClick={handleEditCode}
                size='sm'
                variant='outline'
              >
                <Pencil className='mr-2 h-4 w-4' />
                Edit Code
              </Button>
              <Button
                onClick={handleDeleteCode}
                size='sm'
                variant='destructive'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete Code
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={codeValues}
            searchKey='name'
            searchPlaceholder='Search code values...'
          />
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
