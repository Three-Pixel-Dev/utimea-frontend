import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, RowSelectionState, Table as ReactTable } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import { codesService, Code } from './codes-service'
import { createCodesTableColumns } from './codes-table-columns'

export function Codes() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const queryClient = useQueryClient()
  const [table, setTable] = useState<ReactTable<Code> | null>(null)

  const { data: paginationData } = useQuery({
    queryKey: ['codes', pagination.pageIndex, pagination.pageSize],
    queryFn: () => codesService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const codes = paginationData?.content || []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this system data? This will also delete all code values.')) {
      return
    }

    toast.promise(
      codesService.delete(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['codes'] })
      }),
      {
        loading: 'Deleting system data...',
        success: 'System data deleted successfully!',
        error: 'Failed to delete system data',
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

    if (!confirm(`Are you sure you want to delete ${ids.length} system data item(s)? This will also delete all code values.`)) {
      return
    }

    toast.promise(
      codesService.deleteMany(ids).then(() => {
        setRowSelection({})
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: ['codes'] })
      }),
      {
        loading: `Deleting ${ids.length} system data item(s)...`,
        success: `${ids.length} system data item(s) deleted successfully!`,
        error: 'Failed to delete system data',
      }
    )
  }

  const columns = createCodesTableColumns({ onDelete: handleDelete })

  return (
    <>
      <AdminTableLayout
        title='System Data'
        description='View and manage all system data in the system.'
        cardTitle='System Data List'
        cardDescription='A list of all available system data'
        columns={columns}
        data={codes}
        searchKey='name'
        searchPlaceholder='Filter system data...'
        pageCount={paginationData?.totalPages}
        totalItems={paginationData?.totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
        onTableReady={(tableInstance) => {
          setTable(tableInstance as ReactTable<Code>)
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
      {table && (
        <DataTableBulkActions table={table} entityName='system data'>
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
