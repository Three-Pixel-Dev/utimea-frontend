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

const topNav = []

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

    const { data: timetable, isLoading: isLoadingTimetable } = useQuery({
      queryKey: ['timetable', id],
      queryFn: () => timetablesService.getById(Number(id)),
    })

    const { data: timetableDays = [] } = useQuery({
      queryKey: ['timetableDays'],
      queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_DAYS'),
    })

    const { data: timetablePeriods = [] } = useQuery({
      queryKey: ['timetablePeriods'],
      queryFn: () => codesService.getCodeValuesByConstantValue('TIMETABLE_PERIODS'),
    })

    const { data: allTimetables, isLoading: isLoadingAll } = useQuery({
      queryKey: ['timetables', 'all', timetable?.timetableInfo?.majorSection?.id, timetable?.timetableInfo?.academicYear?.id],
      queryFn: async () => {
        const response = await timetablesService.getAll({
          page: 0,
          size: 10000,
          filter: {
            majorSectionId: timetable?.timetableInfo.majorSection.id,
            academicYearId: timetable?.timetableInfo.academicYear.id,
          },
        })
        return response.content
      },
      enabled: !!timetable,
    })

    const timetableGrid = useMemo(() => {
      if (!allTimetables || !timetableDays.length || !timetablePeriods.length) {
        return null
      }

      const grid: Record<string, Record<string, (typeof allTimetables)[0] | null>> = {}

      timetableDays.forEach((day) => {
        grid[day.id] = {}
        timetablePeriods.forEach((period) => {
          grid[day.id][period.id] = null
        })
      })

      allTimetables.forEach((tt) => {
        const dayId = tt.timetableData.timetableDay.id
        const periodId = tt.timetableData.timetablePeriod.id
        if (grid[dayId] && grid[dayId][periodId] === null) {
          grid[dayId][periodId] = tt
        }
      })

      return grid
    }, [allTimetables, timetableDays, timetablePeriods])

    const isLoading = isLoadingTimetable || isLoadingAll

    const handleCellClick = (dayId: number, periodId: number) => {
      const entry = timetableGrid?.[dayId]?.[periodId] || null
      setSelectedCell({
        timetable: entry,
        dayId,
        periodId,
      })
      setIsFormOpen(true)
    }

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
                  {timetable ? (
                    <>
                      <Badge variant='secondary' className='mr-2'>
                        {timetable.timetableInfo.majorSection.name}
                      </Badge>
                      <span>{timetable.timetableInfo.academicYear.name}</span>
                    </>
                  ) : (
                    'Loading timetable information...'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='flex items-center justify-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                  </div>
                ) : timetableGrid ? (
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
                              const entry = timetableGrid[day.id]?.[period.id]
                              return (
                                <td
                                  key={period.id}
                                  onClick={() => handleCellClick(day.id, period.id)}
                                  className={cn(
                                    'border-r p-3 text-center text-sm last:border-r-0 cursor-pointer transition-colors',
                                    entry
                                      ? 'bg-primary/5 hover:bg-primary/10'
                                      : 'hover:bg-muted/50'
                                  )}
                                >
                                  {entry ? (
                                    <div className='space-y-1.5'>
                                      <div className='font-semibold text-primary'>
                                        {entry.timetableData.subject.code}
                                      </div>
                                      <div className='text-xs text-muted-foreground line-clamp-2'>
                                        {entry.timetableData.subject.description || entry.timetableData.subject.code}
                                      </div>
                                      <div className='text-xs font-medium text-muted-foreground'>
                                        Room: {entry.timetableData.room.name}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className='text-muted-foreground/50'>Click to add</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='py-12 text-center text-muted-foreground'>
                    No timetable data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Main>

        {selectedCell && timetable && (
          <TimetableCellForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            timetable={selectedCell.timetable}
            dayId={selectedCell.dayId}
            periodId={selectedCell.periodId}
            majorSectionId={timetable.timetableInfo.majorSection.id}
            academicYearId={timetable.timetableInfo.academicYear.id}
            onSuccess={handleFormSuccess}
          />
        )}
      </>
    )
  },
})
