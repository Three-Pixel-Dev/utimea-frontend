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
import { CodeValue } from './codes-service'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  position: z
    .string()
    .min(1, 'Position is required')
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0
    }, 'Position must be a non-negative number'),
  active: z.boolean(),
})

type CodeValueFormProps = {
  codeId: number
  codeValue?: CodeValue
  mode: 'create' | 'edit'
}

export function CodeValueForm({ codeId, codeValue, mode }: CodeValueFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: codeValue?.name || '',
      description: codeValue?.description || '',
      position: String(codeValue?.position ?? 0),
      active: codeValue?.active ?? true,
    },
  })

  function onSubmit(_data: FormData) {
    setIsLoading(true)

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: mode === 'create' ? 'Creating code value...' : 'Updating code value...',
        success: () => {
          setIsLoading(false)
          navigate({ to: `/codes/${codeId}` as any })
          return mode === 'create'
            ? 'Code value created successfully!'
            : 'Code value updated successfully!'
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
                <Input placeholder='Business' {...field} />
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
                <Input placeholder='Description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='position'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='0'
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
          name='active'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Active</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: `/codes/${codeId}` as any })}
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
