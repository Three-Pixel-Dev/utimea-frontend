import { useNavigate } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Room } from './rooms-service'

function RoomActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() =>
        navigate({ to: `/rooms/edit/${id}` as any })
      }
    >
      <Pencil className='h-4 w-4' />
    </Button>
  )
}

export const roomsTableColumns: ColumnDef<Room>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
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
    accessorKey: 'capacity',
    header: 'Capacity',
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <RoomActions id={row.original.id} />,
    enableHiding: false,
  },
]
