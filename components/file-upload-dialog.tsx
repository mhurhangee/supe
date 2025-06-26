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
import { Multiselect } from '@/components/ui/multiselect'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FileUploadSchema } from '@/lib/types/files'
import { parseClientIO } from '@/lib/utils/parse-client-io'

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
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [projectId, setProjectId] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch projects for dropdown
  const { data: projectsData } = useSWR<{ projects: Project[] }>('/api/project', fetcher)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }
    
    const { success, error: parseError } = parseClientIO(FileUploadSchema, {
      title,
      description,
      tags,
      projectId: projectId || undefined,
    })
    
    if (!success) {
      setError(parseError)
      return
    }
    
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description || '')
      formData.append('tags', JSON.stringify(tags))
      if (projectId && projectId !== 'none') {
        formData.append('projectId', projectId)
      }
      
      const res = await fetch('/api/file', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to upload file')
      
      toast.success('File uploaded successfully')
      setTitle('')
      setDescription('')
      setTags([])
      setProjectId('')
      setFile(null)
      onUploaded?.()
      onOpenChange(false) // Close dialog on success
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload file')
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">File</label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                required
                disabled={loading}
                className="flex-1"
              />
              {file && (
                <div className="text-muted-foreground text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? 'Uploading...' : 'Upload'}
              {!loading && <Upload className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
