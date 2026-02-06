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
    await studentsService.importFromExcel(file)
    // Invalidate queries to refresh the list
    queryClient.invalidateQueries({ queryKey: ['students'] })
    toast.success('Students imported successfully!')
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
