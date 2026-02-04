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
import { Checkbox } from '@/components/ui/checkbox'
import { Code } from './codes-service'

const formSchema = z.object({
  name: z.string().min(1, 'Code name is required'),
  systemDefined: z.boolean(),
})

type CodeFormProps = {
  code?: Code
  mode: 'create' | 'edit'
}

export function CodeForm({ code, mode }: CodeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: code?.name || '',
      systemDefined: code?.systemDefined || false,
    },
  })

  function onSubmit(_data: FormData) {
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: mode === 'create' ? 'Creating code...' : 'Updating code...',
        success: () => {
          setIsLoading(false)
          navigate({ to: '/codes' as any })
          return mode === 'create'
            ? 'Code created successfully!'
            : 'Code updated successfully!'
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
              <FormLabel>Code Name</FormLabel>
              <FormControl>
                <Input placeholder='ADDRESS_TYPE' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='systemDefined'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>System Defined</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/codes' as any })}
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
