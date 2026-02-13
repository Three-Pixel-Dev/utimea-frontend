import { useNavigate } from '@tanstack/react-router'
import { MoreVertical, Eye } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { TimetableChangeRequest } from './timetable-change-requests-service'

function TimetableChangeRequestActions({ id }: { id: number }) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => navigate({ to: `/timetable-change-requests/${id}` as any })}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const timetableChangeRequestsTableColumns: ColumnDef<TimetableChangeRequest>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => row.original.id,
    enableSorting: true,
  },
  {
    id: 'subject',
    accessorFn: (row) => row.timetableData?.subject?.code || '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subject' />
    ),
    cell: ({ row }) => row.original.timetableData?.subject?.code || '-',
    enableSorting: true,
  },
  {
    accessorKey: 'requestType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Request Type' />
    ),
    cell: ({ row }) => {
      const type = row.original.requestType
      return (
        <Badge variant={type === 'ROOM_CHANGE' ? 'default' : 'secondary'}>
          {type === 'ROOM_CHANGE' ? 'Room Change' : 'Period Change'}
        </Badge>
      )
    },
    enableSorting: true,
  },
  {
    id: 'requestedBy',
    accessorFn: (row) => row.requestedBy?.name || '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Requested By' />
    ),
    cell: ({ row }) => row.original.requestedBy?.name || '-',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'secondary'
      if (status === 'APPROVED') {
        variant = 'default'
      } else if (status === 'DECLINED') {
        variant = 'destructive'
      } else if (status === 'COMPLETED') {
        variant = 'outline'
      }
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'requestScope',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Scope' />
    ),
    cell: ({ row }) => {
      const scope = row.original.requestScope
      return scope === 'PERMANENT' ? 'Permanent' : 'Specific Date'
    },
    enableSorting: true,
  },
  {
    accessorKey: 'requestedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Requested At' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.requestedAt)
      return date.toLocaleString()
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        <TimetableChangeRequestActions id={row.original.id} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
]
