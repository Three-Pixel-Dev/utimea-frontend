import { useState, useEffect } from 'react'
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
import { Room, roomsService } from './rooms-service'

const ROOM_TYPES = [
  { value: '1', label: 'Lecture' },
  { value: '2', label: 'PC' },
] as const

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  capacity: z
    .string()
    .min(1, 'Capacity is required')
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 1
    }, 'Capacity must be at least 1'),
  type: z.string().optional(),
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
      name: '',
      capacity: '',
      type: '',
    },
  })

  // Update form values when room data is loaded
  useEffect(() => {
    if (room) {
      form.reset({
        name: room.name || '',
        capacity: room.capacity ? String(room.capacity) : '',
        type: room.type ? String(room.type) : '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const requestData = {
        name: data.name,
        capacity: data.capacity ? Number(data.capacity) : null,
        type: data.type ? Number(data.type) : null,
      }

      if (mode === 'create') {
        await roomsService.create(requestData)
        toast.success('Room created successfully!')
      } else if (room) {
        await roomsService.update(room.id, requestData)
        toast.success('Room updated successfully!')
      }
      setIsLoading(false)
      navigate({ to: '/rooms' as any })
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
          name='type'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select 
                  key={`room-type-${currentValue}-${room?.id || 'new'}`}
                  onValueChange={field.onChange} 
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select room type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
