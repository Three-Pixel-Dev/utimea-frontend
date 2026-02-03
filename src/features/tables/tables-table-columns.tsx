import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { TableItem } from './tables-service'

export const tablesTableColumns: ColumnDef<TableItem>[] = [
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
    accessorKey: 'room',
    header: 'Room',
    enableHiding: false,
  },
  {
    accessorKey: 'seats',
    header: 'Seats',
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false,
  },
]
