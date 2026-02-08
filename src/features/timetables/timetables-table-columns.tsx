import { useNavigate } from '@tanstack/react-router'
import { Pencil, Eye } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Timetable } from './timetables-service'

function TimetableActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <div className='flex gap-2'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => navigate({ to: `/timetables/view/${id}` as any })}
      >
        <Eye className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => navigate({ to: `/timetables/edit/${id}` as any })}
      >
        <Pencil className='h-4 w-4' />
      </Button>
    </div>
  )
}

export const timetablesTableColumns: ColumnDef<Timetable>[] = [
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
    header: 'Actions',
    cell: ({ row }) => <TimetableActions id={row.original.id} />,
    enableHiding: false,
    enableSorting: false,
  },
]
