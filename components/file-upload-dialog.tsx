'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Multiselect } from '@/components/ui/multiselect'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload'

import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import type { Project } from '@/lib/types/projects'

interface FileUploadDialogProps {
  children: React.ReactNode
  onUploaded?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FileUploadDialog({
  children,
  onUploaded,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: FileUploadDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp !== undefined ? openProp : internalOpen
  const onOpenChange = onOpenChangeProp !== undefined ? onOpenChangeProp : setInternalOpen
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [projectId, setProjectId] = useState('none')
  const [loading, setLoading] = useState(false)
  const [fileUploadKey, setFileUploadKey] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch projects for dropdown
  const { data: projectsData } = useSWR<{ projects: Project[] }>('/api/project', fetcher)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (uploadedFiles.length === 0) {
      setError('Please select a file to upload')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFiles[0].file)
      formData.append('title', title || uploadedFiles[0].file.name)
      formData.append('description', description || '')
      formData.append('tags', JSON.stringify(tags))
      if (projectId && projectId !== 'none') {
        formData.append('projectId', projectId)
      }

      const response = await fetch('/api/file', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file')
      }

      toast.success('File uploaded successfully')

      // Reset form
      setUploadedFiles([])
      setTitle('')
      setDescription('')
      setTags([])
      setProjectId('none')
      setFileUploadKey(prev => prev + 1) // Reset file upload component

      // Close dialog and trigger refresh
      onOpenChange(false)
      onUploaded?.()
    } catch (err) {
      console.error('Error uploading file:', err)
      toast.error('Failed to upload file. Please try again.')
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Upload a file to your workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="File name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={52}
            required
            autoFocus
            disabled={loading}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={512}
            disabled={loading}
          />
          <Multiselect
            value={tags}
            onChange={setTags}
            max={3}
            maxLength={16}
            placeholder="Add tag (max 3)"
            disabled={loading}
          />
          <Select value={projectId} onValueChange={setProjectId} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select project (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No project</SelectItem>
              {projectsData?.projects?.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <FileUpload
                key={fileUploadKey}
                onFilesChange={setUploadedFiles}
                maxFiles={1}
                maxFileSize={10 * 1024 * 1024} // 10MB
                acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp']}
                description="Drag & drop or click to upload (PDF or image)"
              />
            </div>
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || uploadedFiles.length === 0} className="gap-2">
              {loading ? 'Uploading...' : 'Upload'}
              {!loading && <Upload className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
