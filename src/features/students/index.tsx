import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { AdminTableLayout } from '@/components/layout/admin-table-layout'
import { Button } from '@/components/ui/button'
import { ExcelImportDialog } from '@/components/excel'
import { studentsService } from './students-service'
import { studentsTableColumns } from './students-table-columns'

export function Students() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: paginationData } = useQuery({
    queryKey: ['students', pagination.pageIndex, pagination.pageSize],
    queryFn: () => studentsService.getAll({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    }),
  })

  const students = paginationData?.content || []

  const handleDownloadTemplate = async () => {
    try {
      await studentsService.downloadTemplate()
      toast.success('Template downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download template')
    }
  }

  const handleDownloadExcel = async () => {
    try {
      await studentsService.exportToExcel()
      toast.success('Students exported successfully!')
    } catch (error) {
      toast.error('Failed to export students')
    }
  }

  const handleImportExcel = async (file: File) => {
    try {
      const result = await studentsService.importFromExcel(file)
      
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['students'] })
      
      // Check if result is valid - be more lenient
      if (!result || typeof result !== 'object') {
        toast.error('Failed to import students: Invalid response from server')
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
        toast.error('Failed to import students: Unexpected response format')
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
          toast.success(`Successfully imported ${successCount} student(s)!`, {
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
          toast.success(`Successfully imported ${result.totalCount} student(s)!`, {
            duration: 3000,
          })
        }, (result.errors?.length || 0) * 300)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to import students'
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <AdminTableLayout
        title='Students'
        description='View and manage all students in the system.'
        cardTitle='Student List'
        cardDescription='A list of all students'
        columns={studentsTableColumns}
        data={students}
        searchKey='name'
        searchPlaceholder='Search students...'
        createPath='/students/new'
        pageCount={paginationData?.totalPages}
        totalItems={paginationData?.totalItems}
        pagination={pagination}
        onPaginationChange={setPagination}
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

      <ExcelImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportExcel}
        title="Import Students from Excel"
        description="Upload an Excel file to import students. Make sure the file follows the required format."
        entityName="students"
      />
    </>
  )
}
