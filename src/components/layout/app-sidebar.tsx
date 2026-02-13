import { Link } from '@tanstack/react-router'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { getSidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useAuthStore } from '@/stores/auth-store'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { state, isMobile, openMobile } = useSidebar()
  const { auth } = useAuthStore()
  
  const sidebarData = getSidebarData(auth.user?.role)
  
  // Use auth store user data if available, otherwise fall back to sidebar data
  const user = auth.user 
    ? { 
        name: auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1), 
        email: auth.user.email,
        avatar: sidebarData.user.avatar
      }
    : sidebarData.user
  
  // On mobile, show text when sidebar is open. On desktop, show text when not collapsed.
  const shouldShowText = isMobile ? openMobile : state === 'expanded'
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <Link
          to='/'
          className='flex items-center gap-2 px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors'
        >
          <img
            src="/UIT-Logo.webp"
            alt="Utimea Admin Logo"
            className="h-8 w-8 shrink-0 object-contain"
          />
          {shouldShowText && (
            <div className='flex flex-col min-w-0'>
              <span className='font-semibold text-sm whitespace-nowrap'>Utimea</span>
              <span className='text-xs text-muted-foreground whitespace-nowrap'>
                {auth.user?.role ? `${auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)} Portal` : 'Admin Dashboard'}
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
