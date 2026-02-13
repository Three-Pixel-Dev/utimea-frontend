import {
  LayoutDashboard,
  DoorOpen,
  GraduationCap,
  Users,
  Code2,
  BookOpen,
  FileText,
  Calendar,
  Bell,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const getSidebarData = (role?: string): SidebarData => {
  const roleLower = role?.toLowerCase() || 'admin'
  
  if (roleLower === 'admin') {
    return {
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
              url: '/admin/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'View Rooms',
              url: '/admin/rooms',
              icon: DoorOpen,
            },
            {
              title: 'View Teachers',
              url: '/admin/teachers',
              icon: GraduationCap,
            },
            {
              title: 'View Students',
              url: '/admin/students',
              icon: Users,
            },
            {
              title: 'View Major Section',
              url: '/admin/major-sections',
              icon: BookOpen,
            },
            {
              title: 'View Subjects',
              url: '/admin/subjects',
              icon: FileText,
            },
            {
              title: 'View Timetable',
              url: '/admin/timetables',
              icon: Calendar,
            },
            {
              title: 'Change Requests',
              url: '/admin/timetable-change-requests',
              icon: Bell,
            },
            {
              title: 'View System Data',
              url: '/admin/codes',
              icon: Code2,
            },        
          ],
        },
      ],
    }
  } else if (roleLower === 'teacher') {
    return {
      user: {
        name: 'Teacher',
        email: 'teacher@utimea.com',
        avatar: '/avatars/shadcn.jpg',
      },
      teams: [],
      navGroups: [
        {
          title: 'Main',
          items: [
            {
              title: 'Welcome',
              url: '/teachers/welcome',
              icon: LayoutDashboard,
            },
            {
              title: 'My Schedule',
              url: '/teachers/schedule',
              icon: Calendar,
            },
            {
              title: 'Change Requests',
              url: '/teachers/timetable-change-requests',
              icon: Bell,
            },
          ],
        },
      ],
    }
  } else if (roleLower === 'student') {
    return {
      user: {
        name: 'Student',
        email: 'student@utimea.com',
        avatar: '/avatars/shadcn.jpg',
      },
      teams: [],
      navGroups: [
        {
          title: 'Main',
          items: [
            {
              title: 'Welcome',
              url: '/students/welcome',
              icon: LayoutDashboard,
            },
            {
              title: 'My Schedule',
              url: '/students/schedule',
              icon: Calendar,
            },
          ],
        },
      ],
    }
  }
  
  // Default to admin
  return getSidebarData('admin')
}

export const sidebarData = getSidebarData()
