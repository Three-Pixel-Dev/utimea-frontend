import { useState, useEffect, useRef } from 'react'
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
import { GraduationCap } from 'lucide-react'

const formSchema = z.object({
  majorSectionId: z.string().min(1, 'Major Section is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  timetableDayId: z.string().min(1, 'Timetable Day is required'),
  timetablePeriodId: z.string().min(1, 'Timetable Period is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  roomId: z.string().min(1, 'Room is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  subjectTypeId: z.string().optional(),
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
  const hasInitialized = useRef(false)

  const { data: timetableDays = [], isLoading: isLoadingDays } = useQuery({
    queryKey: ['timetableDays'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_DAYS'),
  })

  const { data: timetablePeriods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ['timetablePeriods'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_PERIODS'),
  })

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await subjectsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await roomsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const isDataLoading = isLoadingDays || isLoadingPeriods || isLoadingSubjects || isLoadingRooms

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
      teacherId: '',
      subjectTypeId: '',
    },
  })

  useEffect(() => {
    // Reset initialization flag when dialog closes
    if (!open) {
      hasInitialized.current = false
      return
    }

    // Prevent multiple initializations
    if (hasInitialized.current) {
      return
    }

    if (timetable && open && timetableDays.length > 0 && timetablePeriods.length > 0 && subjects.length > 0) {
      // Match by name to find the correct code value IDs
      const dayName = timetable.timetableData.timetableDay.name.toLowerCase().trim()
      const periodName = timetable.timetableData.timetablePeriod.name.toLowerCase().trim()
      
      const matchedDay = timetableDays.find(d => d.codeValue.toLowerCase().trim() === dayName)
      const matchedPeriod = timetablePeriods.find(p => p.codeValue.toLowerCase().trim() === periodName)
      
      const selectedSubject = subjects.find(s => s.id === timetable.timetableData.subject.id)
      const matchedType = timetable.timetableData.subjectType && selectedSubject?.subjectTypes
        ? selectedSubject.subjectTypes.find(st => st.name === timetable.timetableData.subjectType)
        : null
      
      form.reset({
        majorSectionId: String(timetable.timetableInfo.majorSection.id),
        academicYearId: String(timetable.timetableInfo.academicYear.id),
        timetableDayId: matchedDay ? String(matchedDay.id) : String(timetable.timetableData.timetableDay.id),
        timetablePeriodId: matchedPeriod ? String(matchedPeriod.id) : String(timetable.timetableData.timetablePeriod.id),
        subjectId: String(timetable.timetableData.subject.id),
        roomId: String(timetable.timetableData.room.id),
        teacherId: timetable.timetableData.teacher ? String(timetable.timetableData.teacher.id) : '',
        subjectTypeId: matchedType ? String(matchedType.id) : '',
      })
      hasInitialized.current = true
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
        teacherId: '',
        subjectTypeId: '',
      })
      hasInitialized.current = true
    }
  }, [timetable, open, dayId, periodId, majorSectionId, academicYearId, timetableDays, timetablePeriods, subjects])

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
        teacherId: Number(data.teacherId),
        subjectTypeId: data.subjectTypeId ? Number(data.subjectTypeId) : null,
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred'
      toast.error(errorMessage)
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete timetable entry'
      toast.error(errorMessage)
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
                          {isLoadingDays && <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />}
                        </FormLabel>
                        <div className='relative'>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={true || isLoadingDays}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 text-base bg-muted/50'>
                                <SelectValue placeholder={isLoadingDays ? 'Loading days...' : 'Select timetable day'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingDays ? (
                                <SelectItem value='loading' disabled>
                                  <div className='flex items-center gap-2'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Loading days...
                                  </div>
                                </SelectItem>
                              ) : (
                                timetableDays.map((day) => (
                                  <SelectItem key={day.id} value={String(day.id)}>
                                    {day.codeValue}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
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
                          {isLoadingPeriods && <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />}
                        </FormLabel>
                        <div className='relative'>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={true || isLoadingPeriods}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 text-base bg-muted/50'>
                                <SelectValue placeholder={isLoadingPeriods ? 'Loading periods...' : 'Select timetable period'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingPeriods ? (
                                <SelectItem value='loading' disabled>
                                  <div className='flex items-center gap-2'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Loading periods...
                                  </div>
                                </SelectItem>
                              ) : (
                                timetablePeriods.map((period) => (
                                  <SelectItem key={period.id} value={String(period.id)}>
                                    {period.codeValue}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
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
                          {isLoadingSubjects && <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />}
                        </FormLabel>
                        <div className='relative'>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Reset teacher and subject type when subject changes
                              form.setValue('teacherId', '')
                              form.setValue('subjectTypeId', '')
                            }}
                            value={field.value}
                            disabled={isLoadingSubjects}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 text-base justify-start'>
                                <SelectValue placeholder={isLoadingSubjects ? 'Loading subjects...' : 'Select subject'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingSubjects ? (
                                <SelectItem value='loading' disabled>
                                  <div className='flex items-center gap-2'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Loading subjects...
                                  </div>
                                </SelectItem>
                              ) : (
                                subjects.map((subject) => (
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
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name='subjectTypeId'
                    render={({ field }) => {
                      const selectedSubject = subjects.find(s => String(s.id) === form.watch('subjectId'))
                      const availableSubjectTypes = selectedSubject?.subjectTypes || []
                      return (
                        <FormItem className='space-y-2'>
                          <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                            Subject Type
                          </FormLabel>
                          <div className='relative'>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedSubject || availableSubjectTypes.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className='h-12 text-base justify-start'>
                                  <SelectValue 
                                    placeholder={
                                      !selectedSubject 
                                        ? 'Select subject first' 
                                        : availableSubjectTypes.length === 0 
                                        ? 'No subject types' 
                                        : 'Select subject type'
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableSubjectTypes.map((type) => (
                                  <SelectItem key={type.id} value={String(type.id)} className='text-left'>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
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
                          {isLoadingRooms && <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />}
                        </FormLabel>
                        <div className='relative'>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingRooms}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 text-base justify-start'>
                                <SelectValue placeholder={isLoadingRooms ? 'Loading rooms...' : 'Select room'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingRooms ? (
                                <SelectItem value='loading' disabled>
                                  <div className='flex items-center gap-2'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Loading rooms...
                                  </div>
                                </SelectItem>
                              ) : (
                                rooms.map((room) => (
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
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
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

                <FormField
                  control={form.control}
                  name='teacherId'
                  render={({ field }) => {
                    const selectedSubject = subjects.find(s => String(s.id) === form.watch('subjectId'))
                    const availableTeachers = selectedSubject?.teachers || []
                    return (
                      <FormItem className='space-y-2'>
                        <FormLabel className='flex items-center gap-2 text-sm font-medium'>
                          <GraduationCap className='h-4 w-4' />
                          Teacher
                          {isLoadingSubjects && <Loader2 className='h-3 w-3 animate-spin text-muted-foreground' />}
                        </FormLabel>
                        <div className='relative'>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingSubjects || !selectedSubject || availableTeachers.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 text-base justify-start'>
                                <SelectValue 
                                  placeholder={
                                    isLoadingSubjects 
                                      ? 'Loading...' 
                                      : !selectedSubject 
                                      ? 'Select subject first' 
                                      : availableTeachers.length === 0 
                                      ? 'No teachers available' 
                                      : 'Select teacher'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingSubjects ? (
                                <SelectItem value='loading' disabled>
                                  <div className='flex items-center gap-2'>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Loading teachers...
                                  </div>
                                </SelectItem>
                              ) : (
                                availableTeachers.map((teacher) => (
                                  <SelectItem key={teacher.id} value={String(teacher.id)} className='text-left'>
                                    <div className='flex flex-col items-start py-1'>
                                      <span className='font-medium leading-tight text-left'>{teacher.name}</span>
                                      {teacher.degree && (
                                        <span className='text-xs text-muted-foreground leading-tight mt-0.5 text-left'>
                                          {teacher.degree}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                        {selectedSubject && availableTeachers.length === 0 && (
                          <p className='text-xs text-muted-foreground'>No teachers assigned to this subject</p>
                        )}
                      </FormItem>
                    )
                  }}
                />
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
