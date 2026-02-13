import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, DoorOpen, GraduationCap, Users, Plus, Calendar, FileText, Bell } from 'lucide-react'
import { dashboardService } from '@/features/dashboard/dashboard-service'

export function Dashboard() {
  // Fetch dashboard counts from API
  const { data: counts, isLoading } = useQuery({
    queryKey: ['dashboard', 'counts'],
    queryFn: () => dashboardService.getCounts(),
  })

  const totalRooms = counts?.totalRooms ?? 0
  const totalTeachers = counts?.totalTeachers ?? 0
  const totalStudents = counts?.totalStudents ?? 0

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
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>

        {/* Statistics Cards */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Rooms</CardTitle>
              <DoorOpen className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              ) : (
                <>
                  <div className='text-2xl font-bold'>{totalRooms}</div>
                  <p className='text-xs text-muted-foreground'>
                    Available rooms
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Teachers</CardTitle>
              <GraduationCap className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              ) : (
                <>
                  <div className='text-2xl font-bold'>{totalTeachers}</div>
                  <p className='text-xs text-muted-foreground'>
                    Active teachers
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Students</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              ) : (
                <>
                  <div className='text-2xl font-bold'>{totalStudents}</div>
                  <p className='text-xs text-muted-foreground'>
                    Enrolled students
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for managing the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Link to='/admin/rooms/new' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add New Room
                </Button>
              </Link>
              <Link to='/admin/teachers/new' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add New Teacher
                </Button>
              </Link>
              <Link to='/admin/students/new' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add New Student
                </Button>
              </Link>
              <Link to='/admin/timetables/new' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Plus className='mr-2 h-4 w-4' />
                  Create Timetable
                </Button>
              </Link>
              <Link to='/admin/rooms' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <DoorOpen className='mr-2 h-4 w-4' />
                  View All Rooms
                </Button>
              </Link>
              <Link to='/admin/teachers' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <GraduationCap className='mr-2 h-4 w-4' />
                  View All Teachers
                </Button>
              </Link>
              <Link to='/admin/students' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Users className='mr-2 h-4 w-4' />
                  View All Students
                </Button>
              </Link>
              <Link to='/admin/timetables' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Calendar className='mr-2 h-4 w-4' />
                  View Timetables
                </Button>
              </Link>
              <Link to='/admin/subjects' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <FileText className='mr-2 h-4 w-4' />
                  Manage Subjects
                </Button>
              </Link>
              <Link to='/admin/timetable-change-requests' className='block'>
                <Button variant='outline' className='w-full justify-start'>
                  <Bell className='mr-2 h-4 w-4' />
                  Change Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/',
    isActive: true,
    disabled: false,
  },
]
