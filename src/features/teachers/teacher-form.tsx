import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
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
import { Teacher } from './teachers-service'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
  status: z.string().min(1, 'Status is required'),
})

type TeacherFormProps = {
  teacher?: Teacher
  mode: 'create' | 'edit'
}

export function TeacherForm({ teacher, mode }: TeacherFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: teacher?.name || '',
      email: teacher?.email || '',
      department: teacher?.department || '',
      status: teacher?.status || 'Active',
    },
  })

  function onSubmit(_data: FormData) {
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: mode === 'create' ? 'Creating teacher...' : 'Updating teacher...',
        success: () => {
          setIsLoading(false)
          navigate({ to: '/teachers' as any })
          return mode === 'create'
            ? 'Teacher created successfully!'
            : 'Teacher updated successfully!'
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
                <Input placeholder='Dr. John Smith' {...field} />
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
                <Input type='email' placeholder='john.smith@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='department'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder='Mathematics' {...field} />
              </FormControl>
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
                  <SelectItem value='On Leave'>On Leave</SelectItem>
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
