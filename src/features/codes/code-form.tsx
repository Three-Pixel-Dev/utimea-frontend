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
import { Code, codesService } from './codes-service'

const formSchema = z.object({
  name: z.string().min(1, 'Code name is required'),
  constantValue: z.string().min(1, 'Constant value is required'),
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
      constantValue: code?.constantValue || '',
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      if (mode === 'create') {
        await codesService.create({
          name: data.name,
          constantValue: data.constantValue,
        })
        toast.success('Code created successfully!')
      } else if (code) {
        await codesService.update(code.id, {
          name: data.name,
          constantValue: data.constantValue,
        })
        toast.success('Code updated successfully!')
      }
      setIsLoading(false)
      navigate({ to: '/codes' as any })
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
              <FormLabel>Code Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter code name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='constantValue'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Constant Value</FormLabel>
              <FormControl>
                <Input placeholder='Enter constant value' {...field} disabled />
              </FormControl>
              <FormMessage />
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
