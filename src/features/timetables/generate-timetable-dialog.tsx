import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner' 

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

// Import apiClient directly to bypass external code-service dependency issues
import { apiClient } from '@/lib/api-client'
import { timetablesService, type GenerateTimetableRequest } from './timetables-service'

const MAJORS = ['SE', 'KE', 'HPC', 'CN', 'CSec', 'BIS', 'ES'] as const

// FIXED: Updated type to match the actual API response (codeValue instead of name)
type CodeValue = {
  id: number
  codeId: number
  codeValue: string 
  systemDefined: boolean
}

export function GenerateTimetableDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Form State
  const [academicYearId, setAcademicYearId] = useState<string>('')
  const [sem, setSem] = useState<'FIRST_SEM' | 'SECOND_SEM'>('FIRST_SEM')
  
  // Student Counts
  const [counts, setCounts] = useState({
    firstYear: 200,
    secondYear: 200,
    thirdYear: 200,
    fourthYear: 200,
  })

  // Major Counts
  const [majorCounts, setMajorCounts] = useState<Record<string, number>>({
    SE: 20,
    KE: 20,
    HPC: 28,
    CN: 28,
    CSec: 28,
    BIS: 28,
    ES: 28,
  })

  // Fetch Academic Years directly using apiClient
  const { data: academicYears = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ['academic-years'],
    queryFn: async () => {
      // Direct call to get code values by constant
      const response = await apiClient.get<{ data: CodeValue[] }>('/api/code-values/constant-value/ACADEMIC_YEAR')
      return response.data.data
    },
  })

  // Mutation
  const { mutate: generateTimetable, isPending } = useMutation({
    mutationFn: (data: GenerateTimetableRequest) => timetablesService.generate(data),
    onSuccess: (message) => {
      toast.success('Generation Complete', { description: message })
      queryClient.invalidateQueries({ queryKey: ['timetable-infos'] })
      setOpen(false)
    },
    onError: (error: any) => {
      toast.error('Generation Failed', { description: error?.response?.data?.message || 'Unknown error occurred' })
    },
  })

  const handleSubmit = () => {
    if (!academicYearId) {
      toast.error('Please select an Academic Year')
      return
    }

    // Logic for Second Semester: 
    // - Default Year 3 & 4 counts to 1 (to satisfy backend checks)
    // - Use entered values for First Semester
    const thirdYearCount = sem === 'FIRST_SEM' ? Number(counts.thirdYear) : 1
    const fourthYearCount = sem === 'FIRST_SEM' ? Number(counts.fourthYear) : 1

    const payload: GenerateTimetableRequest = {
      academicYearId: Number(academicYearId),
      sem: sem,
      numberOfStudentsInFirstYear: Number(counts.firstYear),
      numberOfStudentsInSecondYear: Number(counts.secondYear),
      numberOfStudentInThirdYear: thirdYearCount,
      numberOfStudentInFourthYear: fourthYearCount,
      thirdYearMajorCounts: majorCounts as any,
    }

    generateTimetable(payload)
  }

  const handleMajorChange = (major: string, val: string) => {
    setMajorCounts(prev => ({
      ...prev,
      [major]: Number(val)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          Generate Timetable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate New Timetable</DialogTitle>
          <DialogDescription>
            Configure student counts and academic parameters to auto-generate schedules.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid gap-6 py-4">
            
            {/* General Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={academicYearId} onValueChange={setAcademicYearId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingYears ? (
                      <div className="p-2 text-xs text-center text-muted-foreground">Loading...</div>
                    ) : (
                      academicYears.map((year) => (
                        <SelectItem key={year.id} value={String(year.id)}>
                          {year.codeValue} {/* FIXED: Using codeValue property */}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={sem} onValueChange={(v: any) => setSem(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_SEM">First Semester (Odd)</SelectItem>
                    <SelectItem value="SECOND_SEM">Second Semester (Even)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Total Student Counts */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Total Student Counts</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year 1 Students</Label>
                  <Input 
                    type="number" 
                    value={counts.firstYear}
                    onChange={(e) => setCounts({...counts, firstYear: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year 2 Students</Label>
                  <Input 
                    type="number" 
                    value={counts.secondYear}
                    onChange={(e) => setCounts({...counts, secondYear: Number(e.target.value)})}
                  />
                </div>
                
                {/* Only show Year 3 & 4 inputs if FIRST_SEM is selected */}
                {sem === 'FIRST_SEM' && (
                  <>
                    <div className="space-y-2">
                      <Label>Year 3 Students</Label>
                      <Input 
                        type="number" 
                        value={counts.thirdYear}
                        onChange={(e) => setCounts({...counts, thirdYear: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year 4 Students</Label>
                      <Input 
                        type="number" 
                        value={counts.fourthYear}
                        onChange={(e) => setCounts({...counts, fourthYear: Number(e.target.value)})}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Major Specific Counts - Only show for SECOND_SEM */}
            {sem === 'SECOND_SEM' && (
              <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
                <h4 className="font-medium text-sm text-primary">3rd Year Major Breakdown</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Specify student count per major for combined classes (used in Sem 2 logic).
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {MAJORS.map((major) => (
                    <div key={major} className="space-y-1">
                      <Label className="text-xs">{major}</Label>
                      <Input 
                        type="number" 
                        className="h-8" 
                        value={majorCounts[major]}
                        onChange={(e) => handleMajorChange(major, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Start Generation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}