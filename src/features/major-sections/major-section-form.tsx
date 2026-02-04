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
import { MajorSection } from './major-sections-service'
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

  // Fetch Major Section Year code values (codeId: 3)
  const { data: majorSectionYearValues = [] } = useQuery({
    queryKey: ['codeValues', 3],
    queryFn: () => codesService.getCodeValues(3),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: majorSection?.name || '',
      majorSectionYear: majorSection?.majorSectionYear || '',
    },
  })

  function onSubmit(_data: FormData) {
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: mode === 'create' ? 'Creating major section...' : 'Updating major section...',
        success: () => {
          setIsLoading(false)
          navigate({ to: '/major-sections' as any })
          return mode === 'create'
            ? 'Major section created successfully!'
            : 'Major section updated successfully!'
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
                <Input placeholder='Computer Science - Year 1' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='majorSectionYear'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major Section Year</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select major section year' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {majorSectionYearValues
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
