import { useNavigate } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    accessorKey: 'systemDefined',
    header: 'System Defined',
    cell: ({ row }) => {
      const isSystemDefined = row.original.systemDefined
      return (
        <div className='flex items-center'>
          {isSystemDefined ? (
            <Badge variant='outline' className='border-green-500 text-green-700 dark:text-green-400'>
              <Check className='mr-1 h-3 w-3' />
              Yes
            </Badge>
          ) : (
            <Badge variant='outline' className='border-red-500 text-red-700 dark:text-red-400'>
              <X className='mr-1 h-3 w-3' />
              No
            </Badge>
          )}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CodeActions code={row.original} />,
    enableHiding: false,
  },
]
