import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, Check, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { timetableChangeRequestsService } from '@/features/timetable-change-requests/timetable-change-requests-service'
import { format } from 'date-fns'

export const Route = createFileRoute('/_authenticated/timetable-change-requests/$id')({
  component: TimetableChangeRequestDetail,
})

function TimetableChangeRequestDetail() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [adminComment, setAdminComment] = useState('')

  const { data: request, isLoading } = useQuery({
    queryKey: ['timetable-change-request', id],
    queryFn: () => timetableChangeRequestsService.getById(Number(id)),
  })

  const processMutation = useMutation({
    mutationFn: (action: 'APPROVE' | 'DECLINE') =>
      timetableChangeRequestsService.processRequest({
        requestId: Number(id),
        action,
        adminComment: adminComment || null,
      }),
    onSuccess: () => {
      toast.success(`Request ${isApproveDialogOpen ? 'approved' : 'declined'} successfully`)
      queryClient.invalidateQueries({ queryKey: ['timetable-change-request', id] })
      queryClient.invalidateQueries({ queryKey: ['timetable-change-requests'] })
      setIsApproveDialogOpen(false)
      setIsDeclineDialogOpen(false)
      setAdminComment('')
      navigate({ to: '/timetable-change-requests' })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to process request')
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Request not found</div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variant = status === 'APPROVED' ? 'default' : status === 'DECLINED' ? 'destructive' : 'secondary'
    return <Badge variant={variant}>{status}</Badge>
  }

  return (
    <>
      <Header />
      <Main>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/timetable-change-requests' })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Change Request Details</h1>
                <p className="text-muted-foreground">Request ID: {request.id}</p>
              </div>
            </div>
            {request.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  onClick={() => setIsApproveDialogOpen(true)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeclineDialogOpen(true)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
                <CardDescription>Basic details of the change request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Request Type</Label>
                  <div className="mt-1">
                    <Badge variant={request.requestType === 'ROOM_CHANGE' ? 'default' : 'secondary'}>
                      {request.requestType === 'ROOM_CHANGE' ? 'Room Change' : 'Period Change'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(request.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Scope</Label>
                  <div className="mt-1">
                    {request.requestScope === 'PERMANENT' ? 'Permanent' : 'Specific Date'}
                  </div>
                </div>
                {request.specificDate && (
                  <div>
                    <Label className="text-muted-foreground">Specific Date</Label>
                    <div className="mt-1">
                      {format(new Date(request.specificDate), 'PPP')}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Requested At</Label>
                  <div className="mt-1">
                    {format(new Date(request.requestedAt), 'PPpp')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timetable Data Information</CardTitle>
                <CardDescription>Details of the affected timetable data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Subject</Label>
                  <div className="mt-1 font-medium">{request.timetableData.subject.code} - {request.timetableData.subject.description || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Day</Label>
                  <div className="mt-1">{request.timetableData.timetableDay.name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Period</Label>
                  <div className="mt-1">{request.timetableData.timetablePeriod.name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Room</Label>
                  <div className="mt-1">{request.timetableData.room.name} {request.timetableData.room.capacity && `(Capacity: ${request.timetableData.room.capacity})`}</div>
                </div>
                {request.timetableData.teacher && (
                  <div>
                    <Label className="text-muted-foreground">Teacher</Label>
                    <div className="mt-1">{request.timetableData.teacher.name}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requested By</CardTitle>
                <CardDescription>Teacher who made the request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <div className="mt-1 font-medium">{request.requestedBy.name}</div>
                </div>
                {request.requestedBy.phoneNumber && (
                  <div>
                    <Label className="text-muted-foreground">Phone Number</Label>
                    <div className="mt-1">{request.requestedBy.phoneNumber}</div>
                  </div>
                )}
                {request.requestedBy.degree && (
                  <div>
                    <Label className="text-muted-foreground">Degree</Label>
                    <div className="mt-1">{request.requestedBy.degree}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Details</CardTitle>
                <CardDescription>
                  {request.requestType === 'ROOM_CHANGE' ? 'New room information' : 'New period information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.requestType === 'ROOM_CHANGE' && request.newRoom && (
                  <div>
                    <Label className="text-muted-foreground">New Room</Label>
                    <div className="mt-1">
                      <div className="font-medium">{request.newRoom.name}</div>
                      {request.newRoom.capacity && (
                        <div className="text-sm text-muted-foreground">
                          Capacity: {request.newRoom.capacity}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {request.requestType === 'PERIOD_CHANGE' && (
                  <>
                    {request.newTimetableDay && (
                      <div>
                        <Label className="text-muted-foreground">New Day</Label>
                        <div className="mt-1">{request.newTimetableDay.name}</div>
                      </div>
                    )}
                    {request.newTimetablePeriod && (
                      <div>
                        <Label className="text-muted-foreground">New Period</Label>
                        <div className="mt-1">{request.newTimetablePeriod.name}</div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {request.requestReason && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Reason</CardTitle>
                  <CardDescription>Reason provided by the teacher</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{request.requestReason}</p>
                </CardContent>
              </Card>
            )}

            {request.status !== 'PENDING' && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Decision</CardTitle>
                  <CardDescription>Processing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.processedBy && (
                    <div>
                      <Label className="text-muted-foreground">Processed By</Label>
                      <div className="mt-1">{request.processedBy.email}</div>
                    </div>
                  )}
                  {request.processedAt && (
                    <div>
                      <Label className="text-muted-foreground">Processed At</Label>
                      <div className="mt-1">
                        {format(new Date(request.processedAt), 'PPpp')}
                      </div>
                    </div>
                  )}
                  {request.adminComment && (
                    <div>
                      <Label className="text-muted-foreground">Admin Comment</Label>
                      <div className="mt-1 text-sm whitespace-pre-wrap">{request.adminComment}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Main>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this change request? This action will update the timetable.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-comment">Admin Comment (Optional)</Label>
              <Textarea
                id="approve-comment"
                placeholder="Add a comment..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => processMutation.mutate('APPROVE')}
              disabled={processMutation.isPending}
            >
              {processMutation.isPending ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this change request? Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="decline-comment">Admin Comment (Required)</Label>
              <Textarea
                id="decline-comment"
                placeholder="Please provide a reason for declining..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => processMutation.mutate('DECLINE')}
              disabled={processMutation.isPending || !adminComment.trim()}
            >
              {processMutation.isPending ? 'Declining...' : 'Decline'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
