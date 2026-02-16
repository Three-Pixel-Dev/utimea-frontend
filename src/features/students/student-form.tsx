import { useState, useEffect } from 'react'
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
import { Student, studentsService } from './students-service'
import { codesService } from '@/features/codes/codes-service'
import { majorSectionsService } from '@/features/major-sections/major-sections-service'

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phoneNumber: z.string().trim().min(1, 'Phone number is required').regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  batchId: z.string().min(1, 'Batch is required'),
  majorSectionId: z.string().min(1, 'Major Section is required'),
})

type StudentFormProps = {
  student?: Student
  mode: 'create' | 'edit'
}

export function StudentForm({ student, mode }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch Batch code values
  const { data: batchList } = useQuery({
    queryKey: ['codeValues', 'BATCH'],
    queryFn: () => codesService.getCodeValuesByConstantValue('BATCH'),
  })

  // Fetch Major Sections
  const { data: majorSectionsPagination } = useQuery({
    queryKey: ['majorSections'],
    queryFn: () => majorSectionsService.getAll({ page: 0, size: 1000 }),
  })

  const batchValues = batchList || []
  const majorSections = majorSectionsPagination?.content || []

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      batchId: '',
      majorSectionId: '',
    },
  })

  // Update form values when student data is loaded
  useEffect(() => {
    if (student) {
      const batchId = student.batch?.id?.toString() || ''
      const majorSectionId = student.majorSection?.id?.toString() || ''
      form.reset({
        name: student.name || '',
        phoneNumber: student.phoneNumber || '',
        email: student.email || '',
        batchId: batchId,
        majorSectionId: majorSectionId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const requestData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        batchId: data.batchId ? Number(data.batchId) : null,
        majorSectionId: data.majorSectionId ? Number(data.majorSectionId) : null,
      }

      if (mode === 'create') {
        await studentsService.create(requestData)
        toast.success('Student created successfully!')
      } else if (student) {
        await studentsService.update(student.id, requestData)
        toast.success('Student updated successfully!')
      }
      setIsLoading(false)
      navigate({ to: '/students' as any })
    } catch (error) {
      setIsLoading(false)
      toast.error('An error occurred')
    }
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
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder='+1234567890' {...field} />
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
                <Input type='email' placeholder='student@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='batchId'
          render={({ field }) => {
            const currentValue = field.value || ''
            const validId = batchValues.some(v => v.id.toString() === currentValue) 
              ? currentValue 
              : ''
            return (
              <FormItem>
                <FormLabel>Batch</FormLabel>
                <Select 
                  key={`batch-${batchValues.length}-${currentValue}-${student?.id || 'new'}`}
                  onValueChange={field.onChange} 
                  value={validId || undefined}
                  disabled={batchValues.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select batch' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batchValues.map((value) => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.codeValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name='majorSectionId'
          render={({ field }) => {
            const currentValue = field.value || ''
            const validId = majorSections.some(s => s.id.toString() === currentValue) 
              ? currentValue 
              : ''
            return (
              <FormItem>
                <FormLabel>Major Section</FormLabel>
                <Select 
                  key={`majorSection-${majorSections.length}-${currentValue}-${student?.id || 'new'}`}
                  onValueChange={field.onChange} 
                  value={validId || undefined}
                  disabled={majorSections.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select major section' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {majorSections.map((section) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
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
