import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Timetable, timetablesService } from './timetables-service'
import { codesService } from '@/features/codes/codes-service'
import { majorSectionsService } from '@/features/major-sections/major-sections-service'
import { subjectsService } from '@/features/subjects/subjects-service'
import { roomsService } from '@/features/rooms/rooms-service'

const createFormSchema = z.object({
  majorSectionId: z.string().min(1, 'Major Section is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
})

const editFormSchema = z.object({
  majorSectionId: z.string().min(1, 'Major Section is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  timetableDayId: z.string().min(1, 'Timetable Day is required'),
  timetablePeriodId: z.string().min(1, 'Timetable Period is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  roomId: z.string().min(1, 'Room is required'),
})

type TimetableFormProps = {
  timetable?: Timetable
  mode: 'create' | 'edit'
}

export function TimetableForm({ timetable, mode }: TimetableFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { data: majorSections = [] } = useQuery({
    queryKey: ['majorSections'],
    queryFn: async () => {
      const response = await majorSectionsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const { data: academicYears = [] } = useQuery({
    queryKey: ['academicYears'],
    queryFn: () => codesService.getCodeValuesByConstantValue('ACADEMIC_YEAR'),
  })

  const { data: timetableDays = [] } = useQuery({
    queryKey: ['timetableDays'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_DAYS'),
    enabled: mode === 'edit',
  })

  const { data: timetablePeriods = [] } = useQuery({
    queryKey: ['timetablePeriods'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_PERIODS'),
    enabled: mode === 'edit',
  })

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await subjectsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
    enabled: mode === 'edit',
  })

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await roomsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
    enabled: mode === 'edit',
  })

  type CreateFormData = z.infer<typeof createFormSchema>
  type EditFormData = z.infer<typeof editFormSchema>
  type FormData = CreateFormData | EditFormData

  const form = useForm<FormData>({
    resolver: zodResolver(mode === 'create' ? createFormSchema : editFormSchema),
    defaultValues: mode === 'create' 
      ? {
          majorSectionId: '',
          academicYearId: '',
        }
      : {
          majorSectionId: '',
          academicYearId: '',
          timetableDayId: '',
          timetablePeriodId: '',
          subjectId: '',
          roomId: '',
        },
  })

  useEffect(() => {
    if (timetable) {
      form.reset({
        majorSectionId: timetable.timetableInfo.majorSection.id
          ? String(timetable.timetableInfo.majorSection.id)
          : '',
        academicYearId: timetable.timetableInfo.academicYear.id
          ? String(timetable.timetableInfo.academicYear.id)
          : '',
        timetableDayId: timetable.timetableData.timetableDay.id
          ? String(timetable.timetableData.timetableDay.id)
          : '',
        timetablePeriodId: timetable.timetableData.timetablePeriod.id
          ? String(timetable.timetableData.timetablePeriod.id)
          : '',
        subjectId: timetable.timetableData.subject.id
          ? String(timetable.timetableData.subject.id)
          : '',
        roomId: timetable.timetableData.room.id
          ? String(timetable.timetableData.room.id)
          : '',
      })
    }
  }, [timetable, form])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      if (mode === 'create') {
        const createData = data as CreateFormData
        const requestData = {
          majorSectionId: Number(createData.majorSectionId),
          academicYearId: Number(createData.academicYearId),
        }
        const created = await timetablesService.createInfo(requestData)
        toast.success('Timetable created successfully!')
        setIsLoading(false)
        navigate({ to: `/timetables/view/${created.id}` as any })
      } else if (timetable) {
        const editData = data as EditFormData
        const requestData = {
          majorSectionId: Number(editData.majorSectionId),
          academicYearId: Number(editData.academicYearId),
          timetableDayId: Number(editData.timetableDayId),
          timetablePeriodId: Number(editData.timetablePeriodId),
          subjectId: Number(editData.subjectId),
          roomId: Number(editData.roomId),
        }
        await timetablesService.update(timetable.id, requestData)
        toast.success('Timetable updated successfully!')
        setIsLoading(false)
        navigate({ to: '/timetables' as any })
      }
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
          name='majorSectionId'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Major Section</FormLabel>
                <Select
                  key={`major-section-${currentValue}-${timetable?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select major section' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {majorSections.map((section) => (
                      <SelectItem key={section.id} value={String(section.id)}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name='academicYearId'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select
                  key={`academic-year-${currentValue}-${timetable?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select academic year' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={String(year.id)}>
                        {year.codeValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {mode === 'edit' && (
          <>
            <FormField
              control={form.control}
              name='timetableDayId'
              render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Timetable Day</FormLabel>
                <Select
                  key={`timetable-day-${currentValue}-${timetable?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select timetable day' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timetableDays.map((day) => (
                      <SelectItem key={day.id} value={String(day.id)}>
                        {day.codeValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name='timetablePeriodId'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Timetable Period</FormLabel>
                <Select
                  key={`timetable-period-${currentValue}-${timetable?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select timetable period' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timetablePeriods.map((period) => (
                      <SelectItem key={period.id} value={String(period.id)}>
                        {period.codeValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name='subjectId'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  key={`subject-${currentValue}-${timetable?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select subject' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.code} {subject.description ? `- ${subject.description}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name='roomId'
          render={({ field }) => {
            const currentValue = field.value || ''
            return (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <Select
                  key={`room-${currentValue}-${timetable?.id || 'new'}`}
                  onValueChange={field.onChange}
                  value={currentValue || undefined}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 text-base'>
                      <SelectValue placeholder='Select room' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={String(room.id)}>
                        {room.name} {room.capacity ? `(Capacity: ${room.capacity})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />
          </>
        )}

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/timetables' as any })}
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
