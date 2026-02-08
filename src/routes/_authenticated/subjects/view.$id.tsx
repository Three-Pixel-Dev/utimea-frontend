import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { subjectsService } from '@/features/subjects/subjects-service'

export const Route = createFileRoute('/_authenticated/subjects/view/$id')({
  component: () => {
    const { id } = Route.useParams()
    const navigate = useNavigate()

    const { data: subject } = useQuery({
      queryKey: ['subject', id],
      queryFn: () => subjectsService.getById(Number(id)),
    })

    if (!subject) {
      return <div>Loading...</div>
    }

    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/subjects' as any })}
            className='-ml-2'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Subjects
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
            <CardDescription>View subject information</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Subject Code</label>
                <p className='text-lg font-semibold'>{subject.code}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Description</label>
                <p className='text-lg'>{subject.description || '-'}</p>
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-muted-foreground mb-2 block'>
                Subject Types
              </label>
              {subject.subjectTypes && subject.subjectTypes.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {subject.subjectTypes.map((type) => (
                    <Badge key={type.id} variant='secondary' className='text-sm py-1 px-3'>
                      {type.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground'>No subject types assigned</p>
              )}
            </div>

            <div>
              <label className='text-sm font-medium text-muted-foreground mb-2 block'>
                Room Type
              </label>
              {subject.roomType ? (
                <Badge variant='outline' className='text-sm py-1 px-3'>
                  {subject.roomType.name}
                </Badge>
              ) : (
                <p className='text-muted-foreground'>No room type assigned</p>
              )}
            </div>

            <div className='border-t pt-4'>
              <h3 className='text-sm font-medium mb-3'>Metadata</h3>
              <div className='grid gap-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Created At:</span>
                  <span>{new Date(subject.masterData.createdAt).toLocaleString()}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Updated At:</span>
                  <span>{new Date(subject.masterData.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
})
