'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

import { HubLayout } from '@/components/hub-layout'
import { FileActions } from '@/components/file-actions'

import { formatDate } from '@/lib/utils'

import { CalendarDays, Download, FileText, Tags } from 'lucide-react'
import useSWR from 'swr'

export default function FileDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/file/${id}` : null, url =>
    fetch(url).then(res => res.json())
  )
  const file = data?.file

  // Handler for after edit
  function handleUpdated() {
    mutate()
  }

  // Handler for after delete
  function handleDeleted() {
    router.push('/files')
  }

  // Determine if file is an image
  const isImage = file?.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url)

  return (
    <HubLayout
      title={
        <span className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-5 w-5" />
          {isLoading ? <Skeleton className="h-6 w-32" /> : file?.title || 'File'}
        </span>
      }
      description={
        isLoading ? (
          <span className="inline-block align-middle">
            <Skeleton className="h-4 w-48" />
          </span>
        ) : (
          file?.description || 'No description'
        )
      }
      breadcrumbs={[
        { label: 'Files', href: '/files' },
        { label: isLoading ? '...' : file?.title || 'File' },
      ]}
      backTo={{
        label: 'Files',
        href: '/files',
      }}
      actions={
        file && (
          <FileActions
            file={file}
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
      ) : file ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(file.createdAt)}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Tags className="h-4 w-4" />
                {file.tags?.length ? (
                  file.tags.map((tag: string) => (
                    <Badge variant="outline" key={tag}>
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span>No tags</span>
                )}
              </div>
            </div>
            <Button asChild className="gap-2">
              <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" /> Preview
            </h3>
            <div className="overflow-hidden rounded-md border">
              {isImage ? (
                <div className="relative h-[400px] w-full">
                  <Image 
                    src={file.url}
                    alt={file.title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <FileText className="h-16 w-16" />
                    <span>Click to view file</span>
                  </a>
                </div>
              )}
            </div>
            
            {file.parsedContent && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4" /> Content
                </h3>
                <div className="max-h-96 overflow-auto rounded border p-4">
                  <pre className="whitespace-pre-wrap">{file.parsedContent}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </HubLayout>
  )
}
