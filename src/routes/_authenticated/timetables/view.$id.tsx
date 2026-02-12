import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { timetablesService, type Timetable } from '@/features/timetables/timetables-service'
import { codesService } from '@/features/codes/codes-service'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { TimetableCellForm } from '@/features/timetables/timetable-cell-form'
import { cn } from '@/lib/utils'

const topNav: never[] = []

export const Route = createFileRoute('/_authenticated/timetables/view/$id')({
  component: () => {
    const { id } = Route.useParams()
    const navigate = useNavigate()
    const [selectedCell, setSelectedCell] = useState<{
      timetable: Timetable | null
      dayId: number
      periodId: number
    } | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const { data: timetableInfoWithTimetables, isLoading: isLoadingData } = useQuery({
      queryKey: ['timetable-info-with-timetables', id],
      queryFn: () => timetablesService.getInfoById(Number(id)),
    })

    const { data: timetableDays = [], isLoading: isLoadingDays } = useQuery({
      queryKey: ['timetableDays'],
      queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_DAYS'),
    })

    const { data: timetablePeriods = [], isLoading: isLoadingPeriods } = useQuery({
      queryKey: ['timetablePeriods'],
      queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_PERIODS'),
    })

    const allTimetables = timetableInfoWithTimetables?.timetables || []
    const timetableInfo = timetableInfoWithTimetables

    const timetableGrid = useMemo(() => {
      if (!timetableDays.length || !timetablePeriods.length) {
        return null
      }

      // Create maps to match timetable data by name to code value IDs
      const dayMapByName = new Map(timetableDays.map(day => [day.codeValue.toLowerCase().trim(), day.id]))
      const periodMapByName = new Map(timetablePeriods.map(period => [period.codeValue.toLowerCase().trim(), period.id]))

      const grid: Record<string, Record<string, (typeof allTimetables)[0] | null>> = {}

      // Initialize grid with all day/period combinations
      timetableDays.forEach((day) => {
        grid[String(day.id)] = {}
        timetablePeriods.forEach((period) => {
          grid[String(day.id)][String(period.id)] = null
        })
      })

      // Populate grid with timetable entries
      if (allTimetables.length > 0) {
        allTimetables.forEach((tt) => {
          // Match by name first (more reliable than ID)
          const dayName = tt.timetableData.timetableDay.name.toLowerCase().trim()
          const periodName = tt.timetableData.timetablePeriod.name.toLowerCase().trim()
          
          const codeDayId = dayMapByName.get(dayName) ?? tt.timetableData.timetableDay.id
          const codePeriodId = periodMapByName.get(periodName) ?? tt.timetableData.timetablePeriod.id
          
          const dayIdStr = String(codeDayId)
          const periodIdStr = String(codePeriodId)
          // tt.timetableData.subjectType
          if (grid[dayIdStr] && grid[dayIdStr][periodIdStr] === null) {
            grid[dayIdStr][periodIdStr] = tt
          }
        })
      }

      return grid
    }, [allTimetables, timetableDays, timetablePeriods])

    const isLoading = isLoadingData || isLoadingDays || isLoadingPeriods

    const handleCellClick = (dayId: number, periodId: number) => {
      const entry = timetableGrid?.[String(dayId)]?.[String(periodId)] || null
      setSelectedCell({
        timetable: entry,
        dayId,
        periodId,
      })
      setIsFormOpen(true)
    }

    // Create a map of unique subjects with their lecturers
    const subjectLegend = useMemo(() => {
      const subjectMap = new Map<
        string,
        {
          code: string
          description: string | null
          lecturers: string[]
        }
      >()

      allTimetables.forEach((tt) => {
        const subjectCode = tt.timetableData.subject.code
        
        if (!subjectMap.has(subjectCode)) {
          const teacher = tt.timetableData.teacher
          console.log(teacher)
          const lecturerNames: string[] = []

          if (teacher?.name) {
            lecturerNames.push(teacher.name)
          }

          subjectMap.set(subjectCode, {
            code: subjectCode,
            description: tt.timetableData.subject.description,
            lecturers: lecturerNames,
          })
        } else {
          const existing = subjectMap.get(subjectCode)!
          const teacherName = tt.timetableData.teacher?.name

          if (teacherName && !existing.lecturers.includes(teacherName)) {
            existing.lecturers.push(teacherName)
          }
        }
      })

      return Array.from(subjectMap.values()).sort((a, b) => a.code.localeCompare(b.code))
    }, [allTimetables])

    const handleFormSuccess = () => {
      // Refetch data will happen automatically via query invalidation
    }

    return (
      <>
        <Header>
          <TopNav links={topNav} />
          <div className='ms-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => navigate({ to: '/timetables' as any })}
                  className='-ml-2'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to Timetables
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5 text-primary' />
                  <CardTitle>Timetable View</CardTitle>
                </div>
                <CardDescription>
                  {timetableInfo ? (
                    <>
                      <Badge variant='secondary' className='mr-2'>
                        {timetableInfo.majorSection.name}
                      </Badge>
                      <span>{timetableInfo.academicYear.name}</span>
                    </>
                  ) : (
                    'Loading timetable information...'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {isLoading && !timetableGrid && (!timetableDays.length || !timetablePeriods.length) ? (
                  <div className='flex items-center justify-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                  </div>
                ) : (timetableDays.length > 0 && timetablePeriods.length > 0) ? (
                  <>
                    <div className='overflow-x-auto rounded-lg border'>
                      <table className='w-full border-collapse'>
                        <thead>
                          <tr className='border-b bg-muted/50'>
                            <th className='border-r p-3 text-left font-semibold'>
                              DAY \ PERIOD
                            </th>
                            {timetablePeriods.map((period) => (
                              <th
                                key={period.id}
                                className='border-r p-3 text-center font-semibold last:border-r-0'
                              >
                                {period.codeValue}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {timetableDays.map((day, dayIndex) => (
                            <tr
                              key={day.id}
                              className={dayIndex < timetableDays.length - 1 ? 'border-b' : ''}
                            >
                              <td className='border-r bg-muted/30 p-3 font-medium'>
                                {day.codeValue}
                              </td>
                              {timetablePeriods.map((period) => {
                                const entry = timetableGrid?.[String(day.id)]?.[String(period.id)]
                                return (
                                  <td
                                    key={period.id}
                                    onClick={() => handleCellClick(Number(day.id), Number(period.id))}
                                    className={cn(
                                      'border-r p-3 text-center text-sm last:border-r-0 cursor-pointer transition-colors min-w-[120px]',
                                      entry
                                        ? 'bg-primary/5 hover:bg-primary/10'
                                        : 'hover:bg-muted/50'
                                    )}
                                  >
                                    {isLoading && !entry ? (
                                      <div className='flex items-center justify-center'>
                                        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                                      </div>
                                    ) : entry ? (
                                      <div className='space-y-1'>
                                        <div className='font-semibold text-primary'>
                                          {entry.timetableData.subject.code}
                                        </div>
                                        <div className='text-xs text-muted-foreground'>
                                          {entry.timetableData.room.name} • {entry.timetableData.subjectType}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className='text-muted-foreground/50 text-xs'>Click to add</span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Subject Legend */}
                    {subjectLegend.length > 0 && (
                      <div className='rounded-lg border bg-card'>                        
                        <div className='overflow-x-auto'>
                          <table className='w-full'>
                            <thead>
                              <tr className='border-b bg-muted/30'>
                                <th className='p-3 text-left font-semibold text-sm'>Subject Code</th>
                                <th className='p-3 text-left font-semibold text-sm'>Subject Description</th>
                                <th className='p-3 text-left font-semibold text-sm'>Lecturer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subjectLegend.map((subject, index) => (
                                <tr
                                  key={subject.code}
                                  className={index < subjectLegend.length - 1 ? 'border-b' : ''}
                                >
                                  <td className='p-3 font-medium text-sm'>{subject.code}</td>
                                  <td className='p-3 text-sm text-muted-foreground'>
                                    {subject.description || '-'}
                                  </td>
                                  <td className='p-3 text-sm text-muted-foreground'>
                                    {subject.lecturers.length > 0
                                      ? subject.lecturers.join(', ')
                                      : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='py-12 text-center text-muted-foreground'>
                    {isLoading ? 'Loading timetable data...' : 'No timetable data available'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Main>

        {selectedCell && timetableInfo && (
          <TimetableCellForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            timetable={selectedCell.timetable}
            dayId={selectedCell.dayId}
            periodId={selectedCell.periodId}
            majorSectionId={timetableInfo.majorSection.id}
            academicYearId={timetableInfo.academicYear.id}
            onSuccess={handleFormSuccess}
          />
        )}
      </>
    )
  },
})
