import { Pencil, Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CodeValue } from './codes-service'

type CodeValuesTableColumnsProps = {
  onEdit: (value: CodeValue) => void
  onDelete: (valueId: number) => void
}

export function createCodeValuesTableColumns({
  onEdit,
  onDelete,
}: CodeValuesTableColumnsProps): ColumnDef<CodeValue>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: ({ row }) => (
        <Checkbox checked={row.original.active} disabled />
      ),
    },
    {
      accessorKey: 'systemDefined',
      header: 'System Defined',
      cell: ({ row }) => (
        <Checkbox checked={row.original.systemDefined ?? true} disabled />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(row.original)}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(row.original.id)}
          >
            <Trash2 className='h-4 w-4 text-destructive' />
          </Button>
        </div>
      ),
    },
  ]
}
