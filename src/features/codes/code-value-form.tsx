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
import { Checkbox } from '@/components/ui/checkbox'
import { CodeValue, codesService } from './codes-service'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  active: z.boolean(),
  systemDefined: z.boolean(),
})

type CodeValueFormProps = {
  codeId: number
  codeValue?: CodeValue
  mode: 'create' | 'edit'
}

export function CodeValueForm({ codeId, codeValue, mode }: CodeValueFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: codeValue?.name || '',
      active: codeValue?.active ?? true,
      systemDefined: codeValue?.systemDefined !== undefined ? codeValue.systemDefined : true,
    },
  })

  // Reset form when codeValue changes (for edit mode)
  useEffect(() => {
    if (codeValue && mode === 'edit') {
      form.reset({
        name: codeValue.name || '',
        active: codeValue.active ?? true,
        systemDefined: codeValue.systemDefined !== undefined ? codeValue.systemDefined : true,
      })
    }
  }, [codeValue, mode, form])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      if (mode === 'create') {
        await codesService.createCodeValue(codeId, {
          codeId,
          name: data.name,
          systemDefined: data.systemDefined,
        })
        toast.success('Code value created successfully!')
      } else if (codeValue) {
        await codesService.updateCodeValue(codeValue.id, {
          codeId,
          name: data.name,
          systemDefined: data.systemDefined,
        })
        toast.success('Code value updated successfully!')
      }
      queryClient.invalidateQueries({ queryKey: ['codeValues', codeId] })
      setIsLoading(false)
      navigate({ to: `/codes/${codeId}` as any })
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
                <Input placeholder='Business' {...field} />
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
