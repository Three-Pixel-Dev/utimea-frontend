import {
  LayoutDashboard,
  DoorOpen,
  GraduationCap,
  Users,
  Code2,
  BookOpen,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@utimea.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [],
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
          title: 'View Teachers',
          url: '/teachers',
          icon: GraduationCap,
        },
        {
          title: 'View Students',
          url: '/students',
          icon: Users,
        },
        {
          title: 'View Major Section',
          url: '/major-sections',
          icon: BookOpen,
        },
        {
          title: 'View System Data',
          url: '/codes',
          icon: Code2,
        },
        {
          title: 'View Timetable',
          url: '/timetables',
          icon: Code2,
        },
      ],
    },
  ],
}
