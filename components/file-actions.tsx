'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { FileDeleteDialog } from '@/components/file-delete-dialog'
import { FileEditDialog } from '@/components/file-edit-dialog'

import type { File } from '@/lib/types/files'

import { Download, Edit2, Trash2 } from 'lucide-react'
import { mutate } from 'swr'

export interface FileActionsProps {
  file: File
  showOpenButton?: boolean
  onUpdated?: () => void
  onDeleted?: () => void
}

export function FileActions({
  file,
  showOpenButton = true,
  onUpdated,
  onDeleted,
}: FileActionsProps) {
  return (
    <div className="flex gap-2">
      <FileEditDialog
        file={file}
        onUpdated={() => {
          mutate('/api/file')
          onUpdated?.()
        }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground"
          aria-label="Edit file"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </FileEditDialog>
      <FileDeleteDialog
        file={file}
        onDeleted={() => {
          mutate('/api/file')
          onDeleted?.()
        }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive"
          aria-label="Delete file"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </FileDeleteDialog>
      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground"
        aria-label="Download file"
        asChild
      >
        <a href={file.url} target="_blank" rel="noopener noreferrer" download>
          <Download className="h-4 w-4" />
        </a>
      </Button>
      {showOpenButton && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/files/${file.id}`}>Open</Link>
        </Button>
      )}
    </div>
  )
}
