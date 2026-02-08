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
    cell: ({ row }) => <StudentActions id={row.original.id} />,
    enableHiding: false,
  },
]
