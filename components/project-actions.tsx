'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ProjectDeleteDialog } from '@/components/project-delete-dialog'
import { ProjectEditDialog } from '@/components/project-edit-dialog'

import type { Project } from '@/lib/types/projects'

import { Edit2, Trash2 } from 'lucide-react'
import { mutate } from 'swr'

export interface ProjectActionsProps {
  project: Project
  showOpenButton?: boolean
  onUpdated?: () => void
  onDeleted?: () => void
}

export function ProjectActions({
  project,
  showOpenButton = true,
  onUpdated,
  onDeleted,
}: ProjectActionsProps) {
  return (
    <div className="flex gap-2">
      <ProjectEditDialog
        project={project}
        onUpdated={() => {
          mutate('/api/project')
          onUpdated?.()
        }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground"
          aria-label="Edit project"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </ProjectEditDialog>
      <ProjectDeleteDialog
        project={project}
        onDeleted={() => {
          mutate('/api/project')
          onDeleted?.()
        }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive"
          aria-label="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ProjectDeleteDialog>
      {showOpenButton && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}`}>Open</Link>
        </Button>
      )}
    </div>
  )
}
