import { useNavigate } from '@tanstack/react-router'
import { Eye, MoreVertical } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TimetableInfo } from './timetables-service'

function TimetableActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => navigate({ to: `/timetables/view/${id}` as any })}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const timetablesTableColumns: ColumnDef<TimetableInfo>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timetable Name' />
    ),
    cell: ({ row }) => row.original.name,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        <TimetableActions id={row.original.id} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]
