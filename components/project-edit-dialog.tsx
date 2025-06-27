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
import { Textarea } from '@/components/ui/textarea'

import { ProjectUpdateSchema } from '@/lib/types/projects'
import type { Project } from '@/lib/types/projects'
import { parseClientIO } from '@/lib/utils/parse-client-io'

import { toast } from 'sonner'

interface ProjectEditDialogProps {
  project: Project
  onUpdated?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function ProjectEditDialog({
  project,
  onUpdated,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: ProjectEditDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp !== undefined ? openProp : internalOpen
  const onOpenChange = onOpenChangeProp !== undefined ? onOpenChangeProp : setInternalOpen
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description ?? '')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { success, error: parseError } = parseClientIO(ProjectUpdateSchema, {
      title,
      description,
      updatedAt: new Date(),
    })
    if (!success) {
      setError(parseError)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/project/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update project')
      toast.success('Project updated')
      onUpdated?.()
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project workspace details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Project name"
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
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
