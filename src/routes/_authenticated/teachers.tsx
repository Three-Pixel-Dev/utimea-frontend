import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Teachers } from '@/features/teachers'

export const Route = createFileRoute('/_authenticated/teachers')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/teachers'
    
    if (isExactMatch) {
      return <Teachers />
    }
    
    return <Outlet />
  },
})
