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

import type { File } from '@/lib/types/files'
import { FileUpdateSchema } from '@/lib/types/files'
import { parseClientIO } from '@/lib/utils/parse-client-io'

import { toast } from 'sonner'

interface FileEditDialogProps {
  file: File
  children: React.ReactNode
  onUpdated?: () => void
}

export function FileEditDialog({ file, children, onUpdated }: FileEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(file.title)
  const [description, setDescription] = useState(file.description || '')
  const [tags, setTags] = useState<string[]>(file.tags || [])
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { success, error: parseError } = parseClientIO(FileUpdateSchema, {
      title,
      description,
      tags,
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
        body: JSON.stringify({ title, description, tags }),
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
          <Multiselect
            value={tags}
            onChange={setTags}
            max={3}
            maxLength={16}
            placeholder="Add tag (max 3)"
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
