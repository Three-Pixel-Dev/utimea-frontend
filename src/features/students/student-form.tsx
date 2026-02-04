import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Student } from './students-service'
import { codesService } from '@/features/codes/codes-service'
import { majorSectionsService } from '@/features/major-sections/major-sections-service'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  batch: z.string().min(1, 'Batch is required'),
  majorSection: z.string().min(1, 'Major section is required'),
  status: z.string().min(1, 'Status is required'),
})

type StudentFormProps = {
  student?: Student
  mode: 'create' | 'edit'
}

export function StudentForm({ student, mode }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch Batch code values (codeId: 1)
  const { data: batchValues = [] } = useQuery({
    queryKey: ['codeValues', 1],
    queryFn: () => codesService.getCodeValues(1),
  })

  // Fetch Major Sections
  const { data: majorSections = [] } = useQuery({
    queryKey: ['majorSections'],
    queryFn: () => majorSectionsService.getAll(),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student?.name || '',
      email: student?.email || '',
      batch: student?.batch || '',
      majorSection: student?.majorSection || '',
      status: student?.status || 'Active',
    },
  })

  function onSubmit(_data: FormData) {
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: mode === 'create' ? 'Creating student...' : 'Updating student...',
        success: () => {
          setIsLoading(false)
          navigate({ to: '/students' as any })
          return mode === 'create'
            ? 'Student created successfully!'
            : 'Student updated successfully!'
        },
        error: 'An error occurred',
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='john.doe@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='batch'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select batch' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {batchValues
                    .filter((value) => value.active)
                    .map((value) => (
                      <SelectItem key={value.id} value={value.name}>
                        {value.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='majorSection'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major Section</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select major section' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {majorSections.map((section) => (
                    <SelectItem key={section.id} value={section.name}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Active'>Active</SelectItem>
                  <SelectItem value='Inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/students' as any })}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
