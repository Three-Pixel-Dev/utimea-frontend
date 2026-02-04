import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Codes } from '@/features/codes'

export const Route = createFileRoute('/_authenticated/codes')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/codes'
    
    if (isExactMatch) {
      return <Codes />
    }
    
    return <Outlet />
  },
})
