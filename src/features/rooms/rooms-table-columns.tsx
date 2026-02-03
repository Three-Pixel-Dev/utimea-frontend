import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Room } from './rooms-service'

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
]
