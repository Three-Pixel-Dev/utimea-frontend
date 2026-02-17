import { useNavigate } from '@tanstack/react-router'
import { Pencil, Eye, Trash2, MoreVertical } from 'lucide-react'
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
import { Subject } from './subjects-service'

type SubjectActionsProps = {
  id: number
  onDelete: (id: number) => void
}

function SubjectActions({ id, onDelete }: SubjectActionsProps) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => navigate({ to: `/subjects/view/${id}` as any })}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: `/subjects/edit/${id}` as any })}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant='destructive'
          onClick={() => onDelete(id)}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type SubjectsTableColumnsProps = {
  onDelete: (id: number) => void
}

export function createSubjectsTableColumns({ onDelete }: SubjectsTableColumnsProps): ColumnDef<Subject>[] {
  return [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      return pageIndex * pageSize + row.index + 1
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        <SubjectActions id={row.original.id} onDelete={onDelete} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]
}

export const subjectsTableColumns: ColumnDef<Subject>[] = createSubjectsTableColumns({ onDelete: () => {} })