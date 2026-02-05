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
import { Teacher, teachersService } from './teachers-service'
import { codesService } from '@/features/codes/codes-service'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().optional(),
  degree: z.string().optional(),
  departmentId: z.string().optional(),
})

type TeacherFormProps = {
  teacher?: Teacher
  mode: 'create' | 'edit'
}

export function TeacherForm({ teacher, mode }: TeacherFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch Department code values
  const { data: departmentList } = useQuery({
    queryKey: ['codeValues', 'DEPARTMENT'],
    queryFn: () => codesService.getCodeValuesByConstantValue('DEPARTMENT'),
  })

  const departmentValues = departmentList || []

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      degree: '',
      departmentId: '',
    },
  })

  // Update form values when teacher data is loaded
  useEffect(() => {
    if (teacher) {
      const departmentId = teacher.department?.id?.toString() || ''
      // Reset form with all values
      form.reset({
        name: teacher.name || '',
        phoneNumber: teacher.phoneNumber || '',
        degree: teacher.degree || '',
        departmentId: departmentId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacher])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const requestData = {
        name: data.name,
        phoneNumber: data.phoneNumber || null,
        degree: data.degree || null,
        departmentId: data.departmentId ? Number(data.departmentId) : null,
      }

      if (mode === 'create') {
        await teachersService.create(requestData)
        toast.success('Teacher created successfully!')
      } else if (teacher) {
        await teachersService.update(teacher.id, requestData)
        toast.success('Teacher updated successfully!')
      }
      setIsLoading(false)
      navigate({ to: '/teachers' as any })
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
                <Input placeholder='Dr. John Smith' {...field} />
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
          name='degree'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input placeholder='Ph.D., M.Sc., etc.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='departmentId'
          render={({ field }) => {
            const currentValue = field.value || ''
            // Verify the value exists in the options
            const validId = departmentValues.some(v => v.id.toString() === currentValue) 
              ? currentValue 
              : ''
            return (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select 
                  key={`department-${departmentValues.length}-${currentValue}-${teacher?.id || 'new'}`}
                  onValueChange={field.onChange} 
                  value={validId || undefined}
                  disabled={departmentValues.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select department' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentValues.map((value) => (
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
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/teachers' as any })}
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
