'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { BackToButton } from '@/components/ui/back-to-button'
import { Skeleton } from '@/components/ui/skeleton'

import { FileActions } from '@/components/file-actions'
import { HubLayout } from '@/components/hub-layout'
import { ProjectActions } from '@/components/project-actions'

import type { UploadedFile } from '@/lib/types/files'
import { formatDate } from '@/lib/utils'

import { CalendarDays, FileText, FolderClosed } from 'lucide-react'
import useSWR from 'swr'

function ProjectFiles({ projectId }: { projectId: string }) {
  const { data, error, isLoading } = useSWR(`/api/file?projectId=${projectId}`, url =>
    fetch(url).then(res => res.json())
  )

  const files = data?.files || []

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />
  }

  if (error) {
    return <div className="text-destructive">Failed to load files</div>
  }

  if (!files.length) {
    return (
      <div className="text-muted-foreground rounded border p-4">
        No files associated with this project
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file: UploadedFile) => (
        <div
          key={file.id}
          className="group hover:bg-accent/50 flex items-center justify-between rounded border p-3"
        >
          <div className="flex items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4" />
            <Link href={`/files/${file.id}`} className="font-medium hover:underline">
              {file.title}
            </Link>
            <span className="text-muted-foreground text-xs">{formatDate(file.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <FileActions file={file} showOpenButton={false} />
          </div>
        </div>
      ))}
    </div>
  )
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
      actions={<BackToButton href="/projects" label="Projects" />}
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
            </div>
            <ProjectActions
              project={project}
              showOpenButton={false}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          </div>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" /> Files
            </h3>
            <ProjectFiles projectId={id} />
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
