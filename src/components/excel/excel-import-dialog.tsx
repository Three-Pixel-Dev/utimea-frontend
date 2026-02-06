'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type ExcelImportResult = {
  successCount: number
  failureCount: number
  totalCount: number
  errors?: Array<{
    rowNumber: number
    column?: string
    message: string
    invalidValue?: string
  }>
}

type ExcelImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (file: File) => Promise<ExcelImportResult>
  title?: string
  description?: string
  acceptedFileTypes?: string
  maxFileSize?: number // in MB
  entityName?: string // e.g., "students" or "teachers"
}

export function ExcelImportDialog({
  open,
  onOpenChange,
  onImport,
  title = 'Import Excel File',
  description = 'Upload an Excel file to import data. Make sure the file follows the required format.',
  acceptedFileTypes = '.xlsx,.xls',
  maxFileSize = 10,
  entityName = 'items',
}: ExcelImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    setError(null)
    setSuccess(false)

    // Validate file type
    const validExtensions = acceptedFileTypes.split(',').map(ext => ext.trim().toLowerCase())
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !validExtensions.includes(`.${fileExtension}`)) {
      setError(`Invalid file type. Please upload a file with one of these extensions: ${acceptedFileTypes}`)
      setFile(null)
      return
    }

    // Validate file size
    const fileSizeMB = selectedFile.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      setError(`File size exceeds the maximum limit of ${maxFileSize}MB`)
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await onImport(file)
      
      // Check if result is valid - be more lenient
      if (!result || typeof result !== 'object') {
        setIsUploading(false)
        return
      }
      
      // Check if result has expected structure (at least one of these should exist)
      const hasValidStructure = 
        result.successCount !== undefined || 
        result.failureCount !== undefined || 
        result.totalCount !== undefined ||
        result.errors !== undefined
      
      if (!hasValidStructure) {
        setError('Failed to import: Unexpected response format')
        setIsUploading(false)
        return
      }
      
      // Check result and show appropriate feedback
      const successCount = result.successCount ?? 0
      const failureCount = result.failureCount ?? 0
      
      if (successCount > 0 && failureCount === 0) {
        // All succeeded
        setSuccess(true)
        setTimeout(() => {
          setFile(null)
          setSuccess(false)
          onOpenChange(false)
        }, 1500)
      } else if (successCount > 0 && failureCount > 0) {
        // Partial success - show summary and close dialog
        setError(`Partial success: ${successCount} succeeded, ${failureCount} failed. Check toast notifications for details.`)
        setTimeout(() => {
          setFile(null)
          setError(null)
          onOpenChange(false)
        }, 3000)
      } else if (failureCount > 0) {
        // All failed - show summary
        const errorCount = result.errors?.length || failureCount || 0
        setError(`Import failed: ${errorCount} error(s). Check toast notifications for details.`)
      } else {
        // If we get here and successCount is 0 but no failures, assume success
        setSuccess(true)
        setTimeout(() => {
          setFile(null)
          setSuccess(false)
          onOpenChange(false)
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setFile(null)
      setError(null)
      setSuccess(false)
      onOpenChange(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
              file && 'border-primary bg-primary/5',
              isUploading && 'pointer-events-none opacity-50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium">Uploading and processing file...</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setError(null)
                  }}
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove file
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-muted p-3">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {acceptedFileTypes.toUpperCase()} (max {maxFileSize}MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                {entityName.charAt(0).toUpperCase() + entityName.slice(1)} imported successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message - Only show when not uploading */}
          {error && !isUploading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Loading Message - Show when uploading */}
          {isUploading && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Processing import... Please wait.
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          {!file && !error && (
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium mb-2">Import Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                <li>Download the template file first to ensure correct format</li>
                <li>Fill in all required fields</li>
                <li>Make sure data follows the specified format</li>
                <li>Upload the completed file here</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import {entityName.charAt(0).toUpperCase() + entityName.slice(1)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
