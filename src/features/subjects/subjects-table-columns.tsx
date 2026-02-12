import { useNavigate } from '@tanstack/react-router'
import { Pencil, Eye, MoreVertical } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Subject } from './subjects-service'

function SubjectActions({ id }: { id: number }) {
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const subjectsTableColumns: ColumnDef<Subject>[] = [
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
        <SubjectActions id={row.original.id} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]
