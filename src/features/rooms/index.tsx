import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import type { PaginationState, RowSelectionState, Table as ReactTable } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import { roomsService, Room } from './rooms-service'
import { createRoomsTableColumns } from './rooms-table-columns'

export function Rooms() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const queryClient = useQueryClient()
  const [table, setTable] = useState<ReactTable<Room> | null>(null)

  const { data: paginationData } = useQuery({
    queryKey: ['rooms', pagination.pageIndex, pagination.pageSize],
    queryFn: () => roomsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const rooms = paginationData?.content || []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return
    }

    toast.promise(
      roomsService.delete(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['rooms'] })
      }),
      {
        loading: 'Deleting room...',
        success: 'Room deleted successfully!',
        error: 'Failed to delete room',
      }
    )
  }

  const handleBulkDelete = async () => {
    if (!table) return
    
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)

    if (ids.length === 0) {
      return
    }

    if (!confirm(`Are you sure you want to delete ${ids.length} room(s)?`)) {
      return
    }

    toast.promise(
      roomsService.deleteMany(ids).then(() => {
        setRowSelection({})
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: ['rooms'] })
      }),
      {
        loading: `Deleting ${ids.length} room(s)...`,
        success: `${ids.length} room(s) deleted successfully!`,
        error: 'Failed to delete rooms',
      }
    )
  }

  const columns = createRoomsTableColumns({ onDelete: handleDelete })

  const handleTableReady = useCallback((tableInstance: any) => {
    if (tableInstance) {
      setTable(tableInstance as ReactTable<Room>)
    }
  }, [])

  return (
    <>
      <AdminTableLayout
        title='Rooms'
        description='View and manage all rooms in the system.'
        cardTitle='Room List'
        cardDescription='A list of all available rooms'
        columns={columns}
        data={rooms}
        searchKey='name'
        searchPlaceholder='Search rooms...'
        createPath='/rooms/new'
        pageCount={paginationData?.totalPages}
        totalItems={paginationData?.totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
        onTableReady={handleTableReady}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
      {table && (
        <DataTableBulkActions 
          table={table} 
          entityName='room'
        >
          <Button
            variant='destructive'
            size='sm'
            onClick={handleBulkDelete}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Selected
          </Button>
        </DataTableBulkActions>
      )}
    </>
  )
}
