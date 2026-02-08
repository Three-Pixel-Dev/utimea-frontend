import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Subject, subjectsService } from './subjects-service'
import { codesService } from '@/features/codes/codes-service'

const formSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  subjectTypeIds: z.array(z.string()).optional(),
  roomTypeId: z.string().optional(),
})

type SubjectFormProps = {
  subject?: Subject
  mode: 'create' | 'edit'
}

export function SubjectForm({ subject, mode }: SubjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { data: subjectTypes = [] } = useQuery({
    queryKey: ['subjectTypes'],
    queryFn: () => codesService.getCodeValuesByConstantValue('SUBJECT_TYPE'),
  })

  const { data: roomTypes = [] } = useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => codesService.getCodeValuesByConstantValue('ROOM_TYPE'),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      description: '',
      subjectTypeIds: [],
      roomTypeId: '',
    },
  })

  useEffect(() => {
    if (subject) {
      form.reset({
        code: subject.code || '',
        description: subject.description || '',
        subjectTypeIds: subject.subjectTypes?.map((st) => String(st.id)) || [],
        roomTypeId: subject.roomType?.id ? String(subject.roomType.id) : '',
      })
    }
  }, [subject, form])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const requestData = {
        code: data.code,
        description: data.description || null,
        subjectTypeIds: data.subjectTypeIds && data.subjectTypeIds.length > 0
          ? data.subjectTypeIds.map((id) => Number(id))
          : null,
        roomTypeId: data.roomTypeId ? Number(data.roomTypeId) : null,
      }

      if (mode === 'create') {
        await subjectsService.create(requestData)
        toast.success('Subject created successfully!')
      } else if (subject) {
        await subjectsService.update(subject.id, requestData)
        toast.success('Subject updated successfully!')
      }
      setIsLoading(false)
      navigate({ to: '/subjects' as any })
    } catch (error) {
      setIsLoading(false)
      toast.error('An error occurred')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Code</FormLabel>
              <FormControl>
                <Input placeholder='CST-5203' {...field} className='h-12 text-base' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter subject description'
                  {...field}
                  className='min-h-[100px] text-base'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='subjectTypeIds'
          render={({ field }) => {
            const selectedIds = field.value || []
            return (
              <FormItem>
                <FormLabel>Subject Types</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-full justify-between h-12 text-base',
                          !selectedIds.length && 'text-muted-foreground'
                        )}
                      >
                        {selectedIds.length > 0
                          ? `${selectedIds.length} selected`
                          : 'Select subject types'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[400px] p-0' align='start'>
                    <div className='max-h-[300px] overflow-y-auto p-2'>
                      {subjectTypes.map((type) => {
                        const isSelected = selectedIds.includes(String(type.id))
                        return (
                          <div
                            key={type.id}
                            className='flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer'
                            onClick={() => {
                              const newValue = isSelected
                                ? selectedIds.filter((id) => id !== String(type.id))
                                : [...selectedIds, String(type.id)]
                              field.onChange(newValue)
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => {
                                const newValue = isSelected
                                  ? selectedIds.filter((id) => id !== String(type.id))
                                  : [...selectedIds, String(type.id)]
                                field.onChange(newValue)
                              }}
                            />
                            <label className='flex-1 cursor-pointer'>
                              {type.codeValue}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
                {selectedIds.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {selectedIds.map((id) => {
                      const type = subjectTypes.find((t) => String(t.id) === id)
                      return type ? (
                        <Badge key={id} variant='secondary' className='text-sm'>
                          {type.codeValue}
                          <button
                            type='button'
                            className='ml-2 hover:text-destructive'
                            onClick={() => {
                              field.onChange(selectedIds.filter((i) => i !== id))
                            }}
                          >
                            ×
                          </button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name='roomTypeId'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select
                  key={`room-type-${currentValue}-${subject?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select room type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roomTypes.map((roomType) => (
                      <SelectItem key={roomType.id} value={String(roomType.id)}>
                        {roomType.codeValue}
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
            onClick={() => navigate({ to: '/subjects' as any })}
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
