import { useNavigate } from '@tanstack/react-router'
import { Eye, MoreVertical } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Code } from './codes-service'

function CodeActions({ code }: { code: Code }) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => navigate({ to: `/codes/${code.id}` as any })}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        <CodeActions code={row.original} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]
