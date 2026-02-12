import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2, Calendar, Clock, BookOpen, DoorOpen, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Timetable, timetablesService } from './timetables-service'
import { codesService } from '@/features/codes/codes-service'
import { subjectsService } from '@/features/subjects/subjects-service'
import { roomsService } from '@/features/rooms/rooms-service'

const formSchema = z.object({
  majorSectionId: z.string().min(1, 'Major Section is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  timetableDayId: z.string().min(1, 'Timetable Day is required'),
  timetablePeriodId: z.string().min(1, 'Timetable Period is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  roomId: z.string().min(1, 'Room is required'),
})

type TimetableCellFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  timetable?: Timetable | null
  dayId: number
  periodId: number
  majorSectionId: number
  academicYearId: number
  onSuccess?: () => void
}

export function TimetableCellForm({
  open,
  onOpenChange,
  timetable,
  dayId,
  periodId,
  majorSectionId,
  academicYearId,
  onSuccess,
}: TimetableCellFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const mode = timetable ? 'edit' : 'create'

  const { data: timetableDays = [] } = useQuery({
    queryKey: ['timetableDays'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_DAYS'),
  })

  const { data: timetablePeriods = [] } = useQuery({
    queryKey: ['timetablePeriods'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_PERIODS'),
  })

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await subjectsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await roomsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      majorSectionId: String(majorSectionId),
      academicYearId: String(academicYearId),
      timetableDayId: '',
      timetablePeriodId: '',
      subjectId: '',
      roomId: '',
    },
  })

  useEffect(() => {
    if (timetable && open && timetableDays.length > 0 && timetablePeriods.length > 0) {
      // Match by name to find the correct code value IDs
      const dayName = timetable.timetableData.timetableDay.name.toLowerCase().trim()
      const periodName = timetable.timetableData.timetablePeriod.name.toLowerCase().trim()
      
      const matchedDay = timetableDays.find(d => d.codeValue.toLowerCase().trim() === dayName)
      const matchedPeriod = timetablePeriods.find(p => p.codeValue.toLowerCase().trim() === periodName)
      
      form.reset({
        majorSectionId: String(timetable.timetableInfo.majorSection.id),
        academicYearId: String(timetable.timetableInfo.academicYear.id),
        timetableDayId: matchedDay ? String(matchedDay.id) : String(timetable.timetableData.timetableDay.id),
        timetablePeriodId: matchedPeriod ? String(matchedPeriod.id) : String(timetable.timetableData.timetablePeriod.id),
        subjectId: String(timetable.timetableData.subject.id),
        roomId: String(timetable.timetableData.room.id),
      })
    } else if (open && timetableDays.length > 0 && timetablePeriods.length > 0) {
      // Try to match by ID first, then fall back to first item
      const matchedDay = timetableDays.find(d => d.id === dayId) || timetableDays.find((_, idx) => idx === 0)
      const matchedPeriod = timetablePeriods.find(p => p.id === periodId) || timetablePeriods.find((_, idx) => idx === 0)
      
      form.reset({
        majorSectionId: String(majorSectionId),
        academicYearId: String(academicYearId),
        timetableDayId: matchedDay ? String(matchedDay.id) : '',
        timetablePeriodId: matchedPeriod ? String(matchedPeriod.id) : '',
        subjectId: '',
        roomId: '',
      })
    }
  }, [timetable, open, dayId, periodId, majorSectionId, academicYearId, form, timetableDays, timetablePeriods])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const requestData = {
        majorSectionId: Number(data.majorSectionId),
        academicYearId: Number(data.academicYearId),
        timetableDayId: Number(data.timetableDayId),
        timetablePeriodId: Number(data.timetablePeriodId),
        subjectId: Number(data.subjectId),
        roomId: Number(data.roomId),
      }

      if (mode === 'create') {
        await timetablesService.create(requestData)
        toast.success('Timetable entry created successfully!')
      } else if (timetable) {
        await timetablesService.update(timetable.id, requestData)
        toast.success('Timetable entry updated successfully!')
      }

      queryClient.invalidateQueries({ queryKey: ['timetable'] })
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!timetable) return

    if (!confirm('Are you sure you want to delete this timetable entry?')) {
      return
    }

    setIsDeleting(true)

    try {
      await timetablesService.delete(timetable.id)
      toast.success('Timetable entry deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['timetable'] })
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to delete timetable entry')
    } finally {
      setIsDeleting(false)
    }
  }

  const selectedDay = timetableDays.find((d) => d.id === Number(form.watch('timetableDayId')))
  const selectedPeriod = timetablePeriods.find((p) => p.id === Number(form.watch('timetablePeriodId')))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col sm:max-w-lg'>
        <SheetHeader className='space-y-3 px-1'>
          <SheetTitle className='text-xl'>
            {mode === 'create' ? 'Create Timetable Entry' : 'Edit Timetable Entry'}
          </SheetTitle>
          <SheetDescription className='text-base'>
            {mode === 'create' ? (
              <>
                Add a new entry for <span className='font-medium'>{selectedDay?.codeValue}</span> at{' '}
                <span className='font-medium'>{selectedPeriod?.codeValue}</span>
              </>
            ) : (
              'Update the timetable entry details below'
            )}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col flex-1'>
            <div className='flex-1 space-y-6 overflow-y-auto py-6 px-1'>
              {/* Locked Fields Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Lock className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm font-medium text-muted-foreground'>Time Slot (Locked)</span>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='timetableDayId'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                          <Calendar className='h-4 w-4' />
                          Day
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={true}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 text-base bg-muted/50'>
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
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='timetablePeriodId'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                          <Clock className='h-4 w-4' />
                          Period
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={true}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 text-base bg-muted/50'>
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
                    )}
                  />
                </div>
              </div>

              <Separator className='my-2' />

              {/* Editable Fields Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>Entry Details</span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='subjectId'
                    render={({ field }) => {
                      const selectedSubject = subjects.find(s => String(s.id) === field.value)
                      return (
                        <FormItem className='space-y-2'>
                          <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                            <BookOpen className='h-4 w-4' />
                            Subject
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 text-base justify-start'>
                                <SelectValue placeholder='Select subject' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={String(subject.id)} className='text-left'>
                                  <div className='flex flex-col items-start py-1'>
                                    <span className='font-medium leading-tight text-left'>{subject.code}</span>
                                    {subject.description && (
                                      <span className='text-xs text-muted-foreground leading-tight mt-0.5 text-left'>
                                        {subject.description}
                                      </span>
                                    )}
                                  </div>
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
                      const selectedSubject = subjects.find(s => String(s.id) === field.value)
                      return (
                        <FormItem className='space-y-2'>
                          <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                            Subject Type
                          </FormLabel>
                          <div className='h-12 flex items-center'>
                            {selectedSubject?.subjectTypes && selectedSubject.subjectTypes.length > 0 ? (
                              <div className='flex flex-wrap gap-1.5'>
                                {selectedSubject.subjectTypes.map((type) => (
                                  <Badge key={type.id} variant='secondary' className='text-xs'>
                                    {type.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className='text-sm text-muted-foreground'>No subject types</span>
                            )}
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='roomId'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                          <DoorOpen className='h-4 w-4' />
                          Room
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 text-base justify-start'>
                              <SelectValue placeholder='Select room' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={String(room.id)} className='text-left'>
                                <div className='flex items-center justify-between w-full gap-2'>
                                  <span className='flex-1 text-left'>{room.name}</span>
                                  {room.capacity && (
                                    <Badge variant='secondary' className='text-xs shrink-0'>
                                      {room.capacity} seats
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-2'>
                    <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                      Room Type
                    </FormLabel>
                    <div className='h-12 flex items-center'>
                      {(() => {
                        const selectedSubject = subjects.find(s => s.id === Number(form.watch('subjectId')))
                        return selectedSubject?.roomType ? (
                          <Badge variant='outline' className='text-sm'>
                            {selectedSubject.roomType.name}
                          </Badge>
                        ) : (
                          <span className='text-sm text-muted-foreground'>No room type assigned</span>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className='flex-col gap-3 sm:flex-row border-t pt-4 mt-4 px-1'>
              <div className='flex gap-2 w-full sm:w-auto order-1 sm:order-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  className='flex-1 sm:flex-initial'
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading} className='flex-1 sm:flex-initial'>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Create Entry' : 'Update Entry'
                  )}
                </Button>
              </div>
              {mode === 'edit' && (
                <Button
                  type='button'
                  variant='destructive'
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='w-full sm:w-auto order-2 sm:order-3'
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Entry
                    </>
                  )}
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
