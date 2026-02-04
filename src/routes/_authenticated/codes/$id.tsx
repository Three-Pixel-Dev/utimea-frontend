import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { CodeDetail } from '@/features/codes/code-detail'

export const Route = createFileRoute('/_authenticated/codes/$id')({
  component: () => {
    const { id } = Route.useParams()
    const location = useLocation()
    const codeId = Number(id)
    
    // Check if this is an exact match (just /codes/:id) or a child route
    const isExactMatch = location.pathname === `/codes/${id}`
    
    if (isExactMatch) {
      return <CodeDetail codeId={codeId} />
    }
    
    return <Outlet />
  },
})
