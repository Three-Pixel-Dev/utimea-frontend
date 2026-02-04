import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AdminLayout } from './admin-layout'

type AdminFormLayoutProps = {
  title: string
  description: string
  cardTitle: string
  cardDescription: string
  backPath: string
  children: React.ReactNode
}

export function AdminFormLayout({
  title,
  description,
  cardTitle,
  cardDescription,
  backPath,
  children,
}: AdminFormLayoutProps) {
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
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate({ to: backPath as any })}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </AdminLayout>
  )
}
