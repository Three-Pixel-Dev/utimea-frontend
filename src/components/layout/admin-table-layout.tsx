import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { AdminLayout } from './admin-layout'

type AdminTableLayoutProps<TData> = {
  title: string
  description: string
  cardTitle: string
  cardDescription: string
  columns: ColumnDef<TData>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  createPath?: string
  headerActions?: React.ReactNode
  // Server-side pagination props
  pageCount?: number
  totalItems?: number
  onPaginationChange?: (pagination: PaginationState) => void
  pagination?: PaginationState
}

export function AdminTableLayout<TData>({
  title,
  description,
  cardTitle,
  cardDescription,
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  createPath,
  headerActions,
  pageCount,
  totalItems,
  onPaginationChange,
  pagination,
}: AdminTableLayoutProps<TData>) {
  const navigate = useNavigate()

  return (
    <AdminLayout title={title} description={description}>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>{cardTitle}</CardTitle>
              <CardDescription>{cardDescription}</CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              {headerActions}
              {createPath && (
                <Button
                  onClick={() => navigate({ to: createPath as any })}
                  size='sm'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Create New
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey={searchKey}
            searchPlaceholder={searchPlaceholder}
            pageCount={pageCount}
            totalItems={totalItems}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
