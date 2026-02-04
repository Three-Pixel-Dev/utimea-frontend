import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { MajorSections } from '@/features/major-sections'

export const Route = createFileRoute('/_authenticated/major-sections')({
  component: () => {
    const location = useLocation()
    const isExactMatch = location.pathname === '/major-sections'
    
    if (isExactMatch) {
      return <MajorSections />
    }
    
    return <Outlet />
  },
})
