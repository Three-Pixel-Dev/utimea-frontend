import { useNavigate } from '@tanstack/react-router'
import { Pencil, Eye } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Subject } from './subjects-service'

function SubjectActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <div className='flex gap-2'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => navigate({ to: `/subjects/view/${id}` as any })}
      >
        <Eye className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => navigate({ to: `/subjects/edit/${id}` as any })}
      >
        <Pencil className='h-4 w-4' />
      </Button>
    </div>
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
    header: 'Actions',
    cell: ({ row }) => <SubjectActions id={row.original.id} />,
    enableHiding: false,
    enableSorting: false,
  },
]
