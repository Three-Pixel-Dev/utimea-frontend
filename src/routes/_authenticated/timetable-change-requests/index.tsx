import { createFileRoute } from '@tanstack/react-router'
import { TimetableChangeRequests } from '@/features/timetable-change-requests'

export const Route = createFileRoute('/_authenticated/timetable-change-requests/')({
  component: TimetableChangeRequests,
})
