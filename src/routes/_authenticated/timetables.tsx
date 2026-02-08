import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Timetables } from '@/features/timetables'

export const Route = createFileRoute('/_authenticated/timetables')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/timetables'
    
    if (isExactMatch) {
      return <Timetables />
    }
    
    return <Outlet />
  },
})
