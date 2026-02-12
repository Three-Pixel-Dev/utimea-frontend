import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => (
        <div className='text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant='destructive'
                onClick={() => onDelete(row.original.id)}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
