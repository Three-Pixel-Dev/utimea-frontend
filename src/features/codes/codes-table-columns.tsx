import { useNavigate } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Code } from './codes-service'

function CodeActions({ code }: { code: Code }) {
  const navigate = useNavigate()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => navigate({ to: `/codes/${code.id}` as any })}
    >
      View
    </Button>
  )
}

export const codesTableColumns: ColumnDef<Code>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code Name' />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Count' />
    ),
    cell: ({ row }) => {
      return <span className='font-medium'>{row.original.count ?? 0}</span>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CodeActions code={row.original} />,
    enableHiding: false,
  },
]
