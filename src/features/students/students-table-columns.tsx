import { useNavigate } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Student } from './students-service'

function StudentActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() =>
        navigate({ to: `/students/edit/${id}` as any })
      }
    >
      <Pencil className='h-4 w-4' />
    </Button>
  )
}

export const studentsTableColumns: ColumnDef<Student>[] = [
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
    accessorKey: 'batch',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Batch' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'majorSection',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Major Section' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <StudentActions id={row.original.id} />,
    enableHiding: false,
  },
]
