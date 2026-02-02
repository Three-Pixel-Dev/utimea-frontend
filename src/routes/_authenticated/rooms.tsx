import { createFileRoute } from '@tanstack/react-router'
import { Rooms } from '@/features/rooms'

export const Route = createFileRoute('/_authenticated/rooms')({
  component: Rooms,
})
