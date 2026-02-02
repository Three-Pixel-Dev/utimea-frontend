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

export function Tables() {
  // Mock data
  const tables = [
    { id: 1, name: 'Table A1', room: 'Room 101', seats: 4, status: 'Available' },
    { id: 2, name: 'Table A2', room: 'Room 101', seats: 4, status: 'Occupied' },
    { id: 3, name: 'Table B1', room: 'Room 102', seats: 6, status: 'Available' },
    { id: 4, name: 'Table B2', room: 'Room 102', seats: 6, status: 'Available' },
    { id: 5, name: 'Table C1', room: 'Room 103', seats: 8, status: 'Reserved' },
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
            <h2 className='text-2xl font-bold tracking-tight'>Tables</h2>
            <p className='text-muted-foreground'>
              View and manage all tables in the system.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Table List</CardTitle>
            <CardDescription>
              A list of all available tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell>{table.id}</TableCell>
                    <TableCell className='font-medium'>{table.name}</TableCell>
                    <TableCell>{table.room}</TableCell>
                    <TableCell>{table.seats}</TableCell>
                    <TableCell>{table.status}</TableCell>
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
