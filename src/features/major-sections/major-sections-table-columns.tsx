import { useNavigate } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { MajorSection } from './major-sections-service'

function MajorSectionActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() =>
        navigate({ to: `/major-sections/edit/${id}` as any })
      }
    >
      <Pencil className='h-4 w-4' />
    </Button>
  )
}

export const majorSectionsTableColumns: ColumnDef<MajorSection>[] = [
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
    accessorKey: 'majorSectionYear',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Major Section Year' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <MajorSectionActions id={row.original.id} />,
    enableHiding: false,
  },
]
