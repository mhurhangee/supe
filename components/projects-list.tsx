import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { ProjectActions } from '@/components/project-actions'

import type { Project } from '@/lib/types/projects'
import { formatDate } from '@/lib/utils'

import { ArrowRight, CalendarDays, FileText, FolderClosed, Tags } from 'lucide-react'

interface ProjectsListProps {
  projects?: Project[]
  isLoading?: boolean
  viewMode?: 'grid' | 'list'
}

export function ProjectsList({ projects, isLoading, viewMode = 'grid' }: ProjectsListProps) {
  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : 'flex flex-col gap-2'
        }
      >
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="text-muted-foreground col-span-2 py-8 text-center">No projects found.</div>
    )
  }

  if (viewMode === 'list') {
    // Simple list view
    return (
      <div className="flex flex-col gap-2">
        {projects.map(project => (
          <div
            key={project.id}
            className="group bg-card flex items-center gap-4 rounded border px-4 py-3 hover:shadow"
          >
            <FolderClosed className="text-muted-foreground h-4 w-4" />
            <div className="flex-1">
              <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                {project.title}
              </Link>
              <div className="text-muted-foreground line-clamp-1 text-xs">
                {project.description ?? 'No description'}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {project.tags?.length > 0 && <Tags className="text-muted-foreground h-4 w-4" />}
                {project.tags?.map(tag => (
                  <Badge variant="outline" key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex min-w-[120px] flex-col items-end gap-2">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <CalendarDays className="h-3 w-3" />
                {formatDate(project.createdAt)}
              </span>
              <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <ProjectActions project={project} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default grid view
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map(project => (
        <Card key={project.id} className="group relative transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderClosed className="text-muted-foreground h-4 w-4" />
              <Link href={`/projects/${project.id}`} className="flex items-center gap-2">
                {project.title}
                <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground line-clamp-2 flex items-center gap-2 text-sm">
              <FileText className="text-muted-foreground h-4 w-4" />
              {project.description ?? 'No description'}
            </p>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.tags?.length > 0 && <Tags className="text-muted-foreground h-4 w-4" />}
              {project.tags?.map(tag => (
                <Badge variant="outline" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ProjectActions project={project} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
