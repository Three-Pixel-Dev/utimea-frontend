import { type ColumnDef } from '@tanstack/react-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
}: AdminTableLayoutProps<TData>) {
  return (
    <AdminLayout title={title} description={description}>
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey={searchKey}
            searchPlaceholder={searchPlaceholder}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
