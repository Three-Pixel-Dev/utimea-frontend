import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Search } from 'lucide-react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { codesService } from '@/features/codes/codes-service'
import { majorSectionsService } from '@/features/major-sections/major-sections-service'
import { subjectsService } from '@/features/subjects/subjects-service'
import { teachersService } from '@/features/teachers/teachers-service'
import { timetablesService, type Timetable } from './timetables-service'
import { roomsService } from '@/features/rooms/rooms-service'

const formSchema = z.object({
  yearId: z.string().min(1, 'Year is required'),
  section1Id: z.string().min(1, 'Section 1 is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  section2Id: z.string().min(1, 'Section 2 is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  period1Id: z.string().min(1, 'Please select a period from section 1'),
  period2Id: z.string().min(1, 'Please select a period from section 2'),
  combineDayId: z.string().min(1, 'Day is required'),
  combinePeriodId: z.string().min(1, 'Period is required'),
  roomId: z.string().min(1, 'Room is required'),
})

export function CombineClassForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchedTimetables, setSearchedTimetables] = useState<Timetable[]>([])
  const navigate = useNavigate()

  const { data: years = [] } = useQuery({
    queryKey: ['majorSectionYears'],
    queryFn: () => codesService.getCodeValuesByConstantValue('MAJOR_SECTION_YEAR'),
  })

  const { data: majorSections = [] } = useQuery({
    queryKey: ['majorSections', 'all'],
    queryFn: async () => {
      const response = await majorSectionsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects', 'all'],
    queryFn: async () => {
      const response = await subjectsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers', 'all'],
    queryFn: async () => {
      const response = await teachersService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  const { data: timetableDays = [] } = useQuery({
    queryKey: ['timetableDays'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_DAYS'),
  })

  const { data: timetablePeriods = [] } = useQuery({
    queryKey: ['timetablePeriods'],
    queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_PERIODS'),
  })

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: async () => {
      const response = await roomsService.getAll({ page: 0, size: 1000 })
      return response.content
    },
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearId: '',
      section1Id: '',
      subjectId: '',
      section2Id: '',
      teacherId: '',
      period1Id: '',
      period2Id: '',
      combineDayId: '',
      combinePeriodId: '',
      roomId: '',
    },
  })

  const yearId = form.watch('yearId')
  const section1Id = form.watch('section1Id')
  const section2Id = form.watch('section2Id')
  const subjectId = form.watch('subjectId')
  const teacherId = form.watch('teacherId')

  // Get selected subject
  const selectedSubject = subjects.find((s) => s.id === Number(subjectId))

  // Filter major sections by selected year
  const filteredSections = majorSections.filter(
    (section) => !yearId || section.majorSectionYear?.id === Number(yearId)
  )

  // Filter teachers by selected subject
  const filteredTeachers = selectedSubject?.teachers || []

  // Reset teacher and searched timetables when subject changes
  useEffect(() => {
    if (subjectId) {
      // Clear teacher selection if current teacher is not in the filtered list
      const currentTeacherId = form.getValues('teacherId')
      if (currentTeacherId && selectedSubject?.teachers) {
        const isTeacherValid = selectedSubject.teachers.some(
          (t) => t.id === Number(currentTeacherId)
        )
        if (!isTeacherValid) {
          form.setValue('teacherId', '')
        }
      }
      // Clear searched timetables when subject changes
      setSearchedTimetables([])
    } else {
      form.setValue('teacherId', '')
      setSearchedTimetables([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId])

  // Filter searched timetables by section
  const section1Timetables = searchedTimetables.filter(
    (timetable) => timetable.timetableInfo.majorSection.id === Number(section1Id)
  )

  const section2Timetables = searchedTimetables.filter(
    (timetable) => timetable.timetableInfo.majorSection.id === Number(section2Id)
  )

  // Search function to fetch timetables by teacher
  async function handleSearch() {
    if (!teacherId) {
      toast.error('Please select a teacher first')
      return
    }

    setIsSearching(true)
    try {
      const timetables = await timetablesService.getByTeacherId(Number(teacherId))
      setSearchedTimetables(timetables)
      toast.success(`Found ${timetables.length} timetable entries for this teacher`)
    } catch (error) {
      toast.error('Failed to search timetables')
      setSearchedTimetables([])
    } finally {
      setIsSearching(false)
    }
  }

  const selectedRoom = rooms.find((r) => r.id === Number(form.watch('roomId')))

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      await timetablesService.combineClass({
        period1Id: Number(data.period1Id),
        period2Id: Number(data.period2Id),
        combineDayId: Number(data.combineDayId),
        combinePeriodId: Number(data.combinePeriodId),
        roomId: Number(data.roomId),
        teacherId: Number(data.teacherId),
      })
      toast.success('Classes combined successfully!')
      navigate({ to: '/timetables' })
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to combine classes'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Selection Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='yearId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Choose' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.id} value={String(year.id)}>
                            {year.codeValue}
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
                name='section1Id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section 1</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!yearId}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Choose' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSections.map((section) => (
                          <SelectItem key={section.id} value={String(section.id)}>
                            {section.name}
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
                name='subjectId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Choose' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={String(subject.id)}>
                            {subject.code} - {subject.description || ''}
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
                name='section2Id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section 2</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!yearId}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Choose' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSections
                          .filter((s) => s.id !== Number(section1Id))
                          .map((section) => (
                            <SelectItem key={section.id} value={String(section.id)}>
                              {section.name}
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
                name='teacherId'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Teacher</FormLabel>
                    <div className='flex gap-2'>
                      <div className='flex-1'>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!subjectId || filteredTeachers.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue
                                placeholder={
                                  !subjectId
                                    ? 'Select subject first'
                                    : filteredTeachers.length === 0
                                    ? 'No teachers available'
                                    : 'Choose'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredTeachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={String(teacher.id)}>
                                {teacher.name}
                                {teacher.degree && ` (${teacher.degree})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type='button'
                        variant='default'
                        onClick={handleSearch}
                        disabled={!teacherId || isSearching}
                        className='shrink-0'
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className='mr-2 h-4 w-4' />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Period Lists */}
            <div className='grid grid-cols-2 gap-6'>
              {/* Section 1 Period List */}
              <div className='space-y-3'>
                <h3 className='font-semibold text-sm'>
                  Section 1 - Subject Period List
                </h3>
                {section1Timetables.length > 0 ? (
                  <FormField
                    control={form.control}
                    name='period1Id'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='space-y-2'
                          >
                            {section1Timetables.map((timetable) => {
                              const day = timetable.timetableData.timetableDay.name
                              const period = timetable.timetableData.timetablePeriod.name
                              const room = timetable.timetableData.room.name
                              return (
                                <div
                                  key={timetable.id}
                                  className='flex items-center space-x-2 rounded-md border p-3 hover:bg-accent cursor-pointer'
                                  onClick={() => field.onChange(String(timetable.id))}
                                >
                                  <RadioGroupItem
                                    value={String(timetable.id)}
                                    id={`period1-${timetable.id}`}
                                    className='cursor-pointer'
                                  />
                                  <Label
                                    htmlFor={`period1-${timetable.id}`}
                                    className='flex-1 cursor-pointer'
                                  >
                                    <div className='text-sm'>
                                      <span className='font-medium'>{day}</span>{' '}
                                      <span>{period}</span>
                                      <span className='text-muted-foreground'> ({room})</span>
                                    </div>
                                  </Label>
                                </div>
                              )
                            })}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : searchedTimetables.length > 0 ? (
                  <div className='text-sm text-muted-foreground py-4 text-center border rounded-md'>
                    No periods found for section 1
                  </div>
                ) : (
                  <div className='text-sm text-muted-foreground py-4 text-center border rounded-md'>
                    Click Search button to find periods
                  </div>
                )}
              </div>

              {/* Section 2 Period List */}
              <div className='space-y-3'>
                <h3 className='font-semibold text-sm'>
                  Section 2 - Subject Period List
                </h3>
                {section2Timetables.length > 0 ? (
                  <FormField
                    control={form.control}
                    name='period2Id'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='space-y-2'
                          >
                            {section2Timetables.map((timetable) => {
                              const day = timetable.timetableData.timetableDay.name
                              const period = timetable.timetableData.timetablePeriod.name
                              const room = timetable.timetableData.room.name
                              return (
                                <div
                                  key={timetable.id}
                                  className='flex items-center space-x-2 rounded-md border p-3 hover:bg-accent cursor-pointer'
                                  onClick={() => field.onChange(String(timetable.id))}
                                >
                                  <RadioGroupItem
                                    value={String(timetable.id)}
                                    id={`period2-${timetable.id}`}
                                    className='cursor-pointer'
                                  />
                                  <Label
                                    htmlFor={`period2-${timetable.id}`}
                                    className='flex-1 cursor-pointer'
                                  >
                                    <div className='text-sm'>
                                      <span className='font-medium'>{day}</span>{' '}
                                      <span>{period}</span>
                                      <span className='text-muted-foreground'> ({room})</span>
                                    </div>
                                  </Label>
                                </div>
                              )
                            })}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : searchedTimetables.length > 0 ? (
                  <div className='text-sm text-muted-foreground py-4 text-center border rounded-md'>
                    No periods found for section 2
                  </div>
                ) : (
                  <div className='text-sm text-muted-foreground py-4 text-center border rounded-md'>
                    Click Search button to find periods
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <Separator />

            {/* Combine Details */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm'>Combine Details</h3>
              
              <div className='space-y-2'>
                <FormLabel className='text-sm font-medium'>Day want to combine</FormLabel>
                <FormField
                  control={form.control}
                  name='combineDayId'
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select day' />
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
              </div>

              <div className='space-y-2'>
                <FormLabel className='text-sm font-medium'>Period want to combine</FormLabel>
                <FormField
                  control={form.control}
                  name='combinePeriodId'
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select period' />
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

              <FormField
                control={form.control}
                name='roomId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select room' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={String(room.id)}>
                            <div className='flex items-center justify-between w-full'>
                              <span>{room.name}</span>
                              {room.capacity && (
                                <Badge variant='secondary' className='ml-2'>
                                  {room.capacity} seats
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedRoom?.capacity && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        Note: {selectedRoom.name} has maximum {selectedRoom.capacity} capacity
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate({ to: '/timetables' })}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Confirm
              </Button>
            </div>
          </form>
        </Form>
  )
}
