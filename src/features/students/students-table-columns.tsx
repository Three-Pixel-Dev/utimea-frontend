import { useNavigate } from '@tanstack/react-router'
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
import { Student } from './students-service'

type StudentActionsProps = {
  id: number
  onDelete: (id: number) => void
}

function StudentActions({ id, onDelete }: StudentActionsProps) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <MoreVertical className='h-4 w-4' />
    </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => navigate({ to: `/students/edit/${id}` as any })}>
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

type StudentsTableColumnsProps = {
  onDelete: (id: number) => void
}

export function createStudentsTableColumns({ onDelete }: StudentsTableColumnsProps): ColumnDef<Student>[] {
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'batch',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Batch' />
    ),
    cell: ({ row }) => {
      const batch = row.original.batch
      return batch ? batch.name : '-'
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'majorSection',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Major Section' />
    ),
    cell: ({ row }) => {
      const majorSection = row.original.majorSection
      return majorSection ? majorSection.name : '-'
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        <StudentActions id={row.original.id} onDelete={onDelete} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]
}

export const studentsTableColumns: ColumnDef<Student>[] = createStudentsTableColumns({ onDelete: () => {} })