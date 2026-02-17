import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, RowSelectionState, Table as ReactTable } from '@tanstack/react-table'
import { Download, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import { ExcelImportDialog } from '@/components/excel'
import { teachersService, Teacher } from './teachers-service'
import { createTeachersTableColumns } from './teachers-table-columns'

export function Teachers() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const [table, setTable] = useState<ReactTable<Teacher> | null>(null)

  const { data: paginationData } = useQuery({
    queryKey: ['teachers', pagination.pageIndex, pagination.pageSize],
    queryFn: () => teachersService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const teachers = paginationData?.content || []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return
    }

    toast.promise(
      teachersService.delete(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['teachers'] })
      }),
      {
        loading: 'Deleting teacher...',
        success: 'Teacher deleted successfully!',
        error: 'Failed to delete teacher',
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

    if (!confirm(`Are you sure you want to delete ${ids.length} teacher(s)?`)) {
      return
    }

    toast.promise(
      teachersService.deleteMany(ids).then(() => {
        setRowSelection({})
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: ['teachers'] })
      }),
      {
        loading: `Deleting ${ids.length} teacher(s)...`,
        success: `${ids.length} teacher(s) deleted successfully!`,
        error: 'Failed to delete teachers',
      }
    )
  }

  const handleDownloadTemplate = async () => {
    try {
      await teachersService.downloadTemplate()
      toast.success('Template downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download template')
    }
  }

  const handleDownloadExcel = async () => {
    try {
      await teachersService.exportToExcel()
      toast.success('Teachers exported successfully!')
    } catch (error) {
      toast.error('Failed to export teachers')
    }
  }

  const handleImportExcel = async (file: File) => {
    try {
      const result = await teachersService.importFromExcel(file)
      
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      
      // Check if result is valid - be more lenient
      if (!result || typeof result !== 'object') {
        toast.error('Failed to import teachers: Invalid response from server')
        if (import.meta.env.DEV) {
          console.error('Invalid result:', result)
        }
        return
      }
      
      // Ensure result has expected structure (at least one of these should exist)
      const hasValidStructure = 
        result.successCount !== undefined || 
        result.failureCount !== undefined || 
        result.totalCount !== undefined ||
        result.errors !== undefined
      
      if (!hasValidStructure) {
        toast.error('Failed to import teachers: Unexpected response format')
        if (import.meta.env.DEV) {
          console.error('Unexpected result format:', result)
        }
        return
      }
      
      // Use default values if properties are missing
      const successCount = result.successCount ?? 0
      const failureCount = result.failureCount ?? 0
      
      // Show individual toast for each error
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error, index) => {
          setTimeout(() => {
            toast.error(
              `Row ${error.rowNumber}${error.column ? ` (${error.column})` : ''}: ${error.message}`,
              {
                duration: 5000,
              }
            )
          }, index * 300) // Stagger toasts by 300ms
        })
      }
      
      // Show success/warning summary
      if (successCount > 0 && failureCount === 0) {
        // All succeeded
        setTimeout(() => {
          toast.success(`Successfully imported ${successCount} teacher(s)!`, {
            duration: 3000,
          })
        }, (result.errors?.length || 0) * 300)
      } else if (successCount > 0 && failureCount > 0) {
        // Partial success
        setTimeout(() => {
          toast.warning(
            `Partially imported: ${successCount} succeeded, ${failureCount} failed.`,
            {
              duration: 4000,
            }
          )
        }, (result.errors?.length || 0) * 300)
      } else if (failureCount > 0 && successCount === 0) {
        // All failed - summary toast
        setTimeout(() => {
          toast.error(
            `Import failed: All ${failureCount} row(s) had errors.`,
            {
              duration: 4000,
            }
          )
        }, (result.errors?.length || 0) * 300)
      } else if (successCount === 0 && failureCount === 0 && result.totalCount > 0) {
        // Edge case: totalCount exists but no success/failure counts - assume success
        setTimeout(() => {
          toast.success(`Successfully imported ${result.totalCount} teacher(s)!`, {
            duration: 3000,
          })
        }, (result.errors?.length || 0) * 300)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to import teachers'
      toast.error(errorMessage)
    }
  }

  const columns = createTeachersTableColumns({ onDelete: handleDelete })

  return (
    <>
      <AdminTableLayout
        title='Teachers'
        description='View and manage all teachers in the system.'
        cardTitle='Teacher List'
        cardDescription='A list of all teachers'
        columns={columns}
        data={teachers}
        searchKey='name'
        searchPlaceholder='Search teachers...'
        createPath='/teachers/new'
        pageCount={paginationData?.totalPages}
        totalItems={paginationData?.totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
        onTableReady={(tableInstance) => {
          setTable(tableInstance as ReactTable<Teacher>)
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        headerActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadExcel}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Excel
            </Button>
          </div>
        }
      />

      {table && (
        <DataTableBulkActions table={table} entityName='teacher'>
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

      <ExcelImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportExcel}
        title="Import Teachers from Excel"
        description="Upload an Excel file to import teachers. Make sure the file follows the required format."
        entityName="teachers"
      />
    </>
  )
}
