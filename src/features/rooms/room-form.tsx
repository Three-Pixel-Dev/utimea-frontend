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
import { Room } from './rooms-service'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  capacity: z
    .string()
    .min(1, 'Capacity is required')
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 1
    }, 'Capacity must be at least 1'),
  status: z.string().min(1, 'Status is required'),
})

type RoomFormProps = {
  room?: Room
  mode: 'create' | 'edit'
}

export function RoomForm({ room, mode }: RoomFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room?.name || '',
      capacity: String(room?.capacity || 30),
      status: room?.status || 'Available',
    },
  })

  function onSubmit(_data: FormData) {
    // TODO: Convert capacity to number when submitting to API
    // const submitData = { ..._data, capacity: Number(_data.capacity) }
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: mode === 'create' ? 'Creating room...' : 'Updating room...',
        success: () => {
          setIsLoading(false)
          navigate({ to: '/rooms' as any })
          return mode === 'create'
            ? 'Room created successfully!'
            : 'Room updated successfully!'
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
                <Input placeholder='Room 101' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='capacity'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='30'
                  value={field.value}
                  onChange={(e) => field.onChange(String(e.target.value || ''))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
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
                  <SelectItem value='Available'>Available</SelectItem>
                  <SelectItem value='Occupied'>Occupied</SelectItem>
                  <SelectItem value='Maintenance'>Maintenance</SelectItem>
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
            onClick={() => navigate({ to: '/rooms' as any })}
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
