import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Subjects } from '@/features/subjects'

export const Route = createFileRoute('/_authenticated/subjects')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/subjects'
    
    if (isExactMatch) {
      return <Subjects />
    }
    
    return <Outlet />
  },
})
