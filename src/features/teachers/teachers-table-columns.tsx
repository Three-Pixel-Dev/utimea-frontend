import { useNavigate } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Teacher } from './teachers-service'

function TeacherActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() =>
        navigate({ to: `/teachers/edit/${id}` as any })
      }
    >
      <Pencil className='h-4 w-4' />
    </Button>
  )
}

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
  {
    id: 'actions',
    cell: ({ row }) => <TeacherActions id={row.original.id} />,
    enableHiding: false,
  },
]
