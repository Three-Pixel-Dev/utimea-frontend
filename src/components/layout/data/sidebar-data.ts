import {
  LayoutDashboard,
  DoorOpen,
  Table,
  GraduationCap,
  Users,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@utimea.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Utimea',
      logo: Command,
      plan: 'Admin Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'View Rooms',
          url: '/rooms',
          icon: DoorOpen,
        },
        {
          title: 'View Tables',
          url: '/tables',
          icon: Table,
        },
        {
          title: 'View Teachers',
          url: '/teachers',
          icon: GraduationCap,
        },
        {
          title: 'View Students',
          url: '/students',
          icon: Users,
        },
      ],
    },
  ],
}
