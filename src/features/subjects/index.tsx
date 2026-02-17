import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, RowSelectionState, Table as ReactTable } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import { subjectsService, Subject } from './subjects-service'
import { createSubjectsTableColumns } from './subjects-table-columns'

export function Subjects() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const queryClient = useQueryClient()
  const [table, setTable] = useState<ReactTable<Subject> | null>(null)

  const { data: paginationData } = useQuery({
    queryKey: ['subjects', pagination.pageIndex, pagination.pageSize],
    queryFn: () => subjectsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const subjects = paginationData?.content || []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) {
      return
    }

    toast.promise(
      subjectsService.delete(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['subjects'] })
      }),
      {
        loading: 'Deleting subject...',
        success: 'Subject deleted successfully!',
        error: 'Failed to delete subject',
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

    if (!confirm(`Are you sure you want to delete ${ids.length} subject(s)?`)) {
      return
    }

    toast.promise(
      subjectsService.deleteMany(ids).then(() => {
        setRowSelection({})
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: ['subjects'] })
      }),
      {
        loading: `Deleting ${ids.length} subject(s)...`,
        success: `${ids.length} subject(s) deleted successfully!`,
        error: 'Failed to delete subjects',
      }
    )
  }

  const columns = createSubjectsTableColumns({ onDelete: handleDelete })

  return (
    <>
      <AdminTableLayout
        title='Subjects'
        description='View and manage all subjects in the system.'
        cardTitle='Subject List'
        cardDescription='A list of all subjects'
        columns={columns}
        data={subjects}
        searchKey='code'
        searchPlaceholder='Search subjects...'
        createPath='/subjects/new'
        pageCount={paginationData?.totalPages}
        totalItems={paginationData?.totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
        onTableReady={(tableInstance) => {
          setTable(tableInstance as ReactTable<Subject>)
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
      {table && (
        <DataTableBulkActions table={table} entityName='subject'>
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
