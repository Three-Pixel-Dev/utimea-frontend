import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function Teachers() {
  // Mock data
  const teachers = [
    { id: 1, name: 'Dr. John Smith', email: 'john.smith@example.com', department: 'Mathematics', status: 'Active' },
    { id: 2, name: 'Prof. Jane Doe', email: 'jane.doe@example.com', department: 'Science', status: 'Active' },
    { id: 3, name: 'Dr. Robert Johnson', email: 'robert.j@example.com', department: 'English', status: 'Active' },
    { id: 4, name: 'Prof. Sarah Williams', email: 'sarah.w@example.com', department: 'History', status: 'On Leave' },
    { id: 5, name: 'Dr. Michael Brown', email: 'michael.b@example.com', department: 'Mathematics', status: 'Active' },
  ]

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Teachers</h2>
            <p className='text-muted-foreground'>
              View and manage all teachers in the system.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Teacher List</CardTitle>
            <CardDescription>
              A list of all teachers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell className='font-medium'>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{teacher.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
