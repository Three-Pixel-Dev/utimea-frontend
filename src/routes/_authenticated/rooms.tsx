import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Rooms } from '@/features/rooms'

export const Route = createFileRoute('/_authenticated/rooms')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/rooms'
    
    if (isExactMatch) {
      return <Rooms />
    }
    
    return <Outlet />
  },
})
