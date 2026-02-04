import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Students } from '@/features/students'

export const Route = createFileRoute('/_authenticated/students')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/students'
    
    if (isExactMatch) {
      return <Students />
    }
    
    return <Outlet />
  },
})
