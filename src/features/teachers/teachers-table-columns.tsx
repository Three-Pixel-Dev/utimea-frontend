import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Teacher } from './teachers-service'

export const teachersTableColumns: ColumnDef<Teacher>[] = [
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false,
  },
]
