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

import type { Project } from '@/lib/types/projects'

import { toast } from 'sonner'

interface ProjectDeleteDialogProps {
  project: Project
  onDeleted?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function ProjectDeleteDialog({
  project,
  onDeleted,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: ProjectDeleteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp !== undefined ? openProp : internalOpen
  const onOpenChange = onOpenChangeProp !== undefined ? onOpenChangeProp : setInternalOpen
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/project/${project.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete project')
      toast.success('Project deleted')
      onDeleted?.()
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>{project.title}</b>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-destructive mb-2 text-sm">{error}</div>}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={loading} onClick={handleDelete}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
