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
import { MajorSection, majorSectionsService } from './major-sections-service'
import { codesService } from '@/features/codes/codes-service'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  majorSectionYear: z.string().min(1, 'Major section year is required'),
})

type MajorSectionFormProps = {
  majorSection?: MajorSection
  mode: 'create' | 'edit'
}

export function MajorSectionForm({ majorSection, mode }: MajorSectionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch Major Section Year code values
  const { data: majorSectionYearValues = [] } = useQuery({
    queryKey: ['codeValues', 'MAJOR_SECTION_YEAR'],
    queryFn: () => codesService.getCodeValuesByConstantValue('MAJOR_SECTION_YEAR'),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      majorSectionYear: '',
    },
  })

  // Update form values when majorSection data is loaded and code values are available
  useEffect(() => {
    if (majorSection && majorSectionYearValues.length > 0) {
      const majorSectionYearId = majorSection.majorSectionYear?.id
      // Reset form with all values at once to ensure proper binding
      // Only set if we have a valid ID and the option exists in the list
      const validId = majorSectionYearId && majorSectionYearValues.some(
        v => v.id === majorSectionYearId
      ) ? majorSectionYearId.toString() : ''
      
      form.reset({
        name: majorSection.name || '',
        majorSectionYear: validId,
      })
    } else if (majorSection) {
      // If majorSection is loaded but code values aren't ready, just set the name
      form.setValue('name', majorSection.name || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [majorSection, majorSectionYearValues.length])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const requestData = {
        name: data.name,
        majorSectionYearId: data.majorSectionYear ? Number(data.majorSectionYear) : null,
      }

      if (mode === 'create') {
        await majorSectionsService.create(requestData)
        toast.success('Major section created successfully!')
      } else if (majorSection) {
        await majorSectionsService.update(majorSection.id, requestData)
        toast.success('Major section updated successfully!')
      }
      setIsLoading(false)
      navigate({ to: '/major-sections' as any })
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
                <Input placeholder='Computer Science - Year 1' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='majorSectionYear'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Major Section Year</FormLabel>
                <Select 
                  key={`select-${majorSectionYearValues.length}-${currentValue}`}
                  onValueChange={field.onChange} 
                  value={currentValue || undefined}
                  disabled={majorSectionYearValues.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select major section year' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {majorSectionYearValues.map((value) => (
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
            onClick={() => navigate({ to: '/major-sections' as any })}
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
