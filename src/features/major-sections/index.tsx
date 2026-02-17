import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, RowSelectionState, Table as ReactTable } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import { majorSectionsService, MajorSection } from './major-sections-service'
import { createMajorSectionsTableColumns } from './major-sections-table-columns'

export function MajorSections() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const queryClient = useQueryClient()
  const [table, setTable] = useState<ReactTable<MajorSection> | null>(null)

  const { data: paginationData } = useQuery({
    queryKey: ['majorSections', pagination.pageIndex, pagination.pageSize],
    queryFn: () => majorSectionsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const majorSections = paginationData?.content || []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this major section?')) {
      return
    }

    toast.promise(
      majorSectionsService.delete(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['majorSections'] })
      }),
      {
        loading: 'Deleting major section...',
        success: 'Major section deleted successfully!',
        error: 'Failed to delete major section',
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

    if (!confirm(`Are you sure you want to delete ${ids.length} major section(s)?`)) {
      return
    }

    toast.promise(
      majorSectionsService.deleteMany(ids).then(() => {
        setRowSelection({})
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: ['majorSections'] })
      }),
      {
        loading: `Deleting ${ids.length} major section(s)...`,
        success: `${ids.length} major section(s) deleted successfully!`,
        error: 'Failed to delete major sections',
      }
    )
  }

  const columns = createMajorSectionsTableColumns({ onDelete: handleDelete })

  return (
    <>
      <AdminTableLayout
        title='Major Sections'
        description='View and manage all major sections in the system.'
        cardTitle='Major Section List'
        cardDescription='A list of all available major sections'
        columns={columns}
        data={majorSections}
        searchKey='name'
        searchPlaceholder='Search major sections...'
        createPath='/major-sections/new'
        pageCount={paginationData?.totalPages}
        totalItems={paginationData?.totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
        onTableReady={(tableInstance) => {
          setTable(tableInstance as ReactTable<MajorSection>)
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
      {table && (
        <DataTableBulkActions table={table} entityName='major section'>
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
