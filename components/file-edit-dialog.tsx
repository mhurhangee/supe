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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import type { UploadedFile } from '@/lib/types/files'
import { FileUpdateSchema } from '@/lib/types/files'
import type { Project } from '@/lib/types/projects'
import { fetcher } from '@/lib/utils'
import { parseClientIO } from '@/lib/utils/parse-client-io'

import { toast } from 'sonner'
import useSWR from 'swr'

interface FileEditDialogProps {
  file: UploadedFile
  children: React.ReactNode
  onUpdated?: () => void
}

export function FileEditDialog({ file, children, onUpdated }: FileEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(file.title)
  const [description, setDescription] = useState(file.description || '')
  const [projectId, setProjectId] = useState(file.projectId || 'none')
  const [error, setError] = useState<string | null>(null)

  // Fetch projects for dropdown
  const { data: projectsData } = useSWR<{ projects: Project[] }>('/api/project', fetcher)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { success, error: parseError } = parseClientIO(FileUpdateSchema, {
      title,
      description,
      projectId: projectId !== 'none' ? projectId : undefined,
    })
    if (!success) {
      setError(parseError)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/file/${file.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          projectId: projectId !== 'none' ? projectId : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update file')
      toast.success('File updated')
      onUpdated?.()
      setOpen(false) // Close dialog on success
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update file')
      setError(err instanceof Error ? err.message : 'Failed to update file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
          <DialogDescription>Update file details.</DialogDescription>
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
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
