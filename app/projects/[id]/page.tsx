'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { HubLayout } from '@/components/hub-layout'
import { ProjectActions } from '@/components/project-actions'

import { formatDate } from '@/lib/utils'

import { CalendarDays, FileText, FolderClosed, Tags } from 'lucide-react'
import useSWR from 'swr'

function ProjectFiles() {
  return <div className="text-muted-foreground rounded border p-4">[Files will be shown here]</div>
}
function ProjectChats() {
  return <div className="text-muted-foreground rounded border p-4">[Chats will be shown here]</div>
}

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/project/${id}` : null, url =>
    fetch(url).then(res => res.json())
  )
  const project = data?.project

  // Handler for after edit
  function handleUpdated() {
    mutate()
  }

  // Handler for after delete
  function handleDeleted() {
    router.push('/projects')
  }

  return (
    <HubLayout
      title={
        <span className="flex items-center gap-2">
          <FolderClosed className="text-muted-foreground h-5 w-5" />
          {isLoading ? <Skeleton className="h-6 w-32" /> : project?.title || 'Project'}
        </span>
      }
      description={
        isLoading ? (
          <span className="inline-block align-middle">
            <Skeleton className="h-4 w-48" />
          </span>
        ) : (
          project?.description || 'No description'
        )
      }
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: isLoading ? '...' : project?.title || 'Project' },
      ]}
      backTo={{
        label: 'Projects',
        href: '/projects',
      }}
      actions={
        project && (
          <ProjectActions
            project={project}
            showOpenButton={false}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        )
      }
    >
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : error ? (
        <div className="text-destructive">{error.message || error.toString()}</div>
      ) : project ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Tags className="h-4 w-4" />
                {project.tags?.length ? (
                  project.tags.map((tag: string) => (
                    <Badge variant="outline" key={tag}>
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span>No tags</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" /> Files
            </h3>
            <ProjectFiles />
            <h3 className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" /> Chats
            </h3>
            <ProjectChats />
          </div>
        </div>
      ) : null}
    </HubLayout>
  )
}
