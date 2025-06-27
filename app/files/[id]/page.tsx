'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ParsedContent } from '@/components/ui/parsed-content'
import { Skeleton } from '@/components/ui/skeleton'

import { FileActions } from '@/components/file-actions'
import { HubLayout } from '@/components/hub-layout'

import { formatDate } from '@/lib/utils'

import { CalendarDays, FileText } from 'lucide-react'
import useSWR from 'swr'
import { BackToButton } from '@/components/ui/back-to-button'

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
      actions={
        <BackToButton href="/files" label="Files" />
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
            </div>
            <FileActions
              file={file}
              showOpenButton={false}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" /> Preview
            </h3>
            <div className="overflow-hidden rounded-md border">
              {isImage ? (
                <div className="relative h-[400px] w-full">
                  <Image src={file.url} alt={file.title} fill className="object-contain" />
                </div>
              ) : file.parsedContent ? (
                <ParsedContent content={file.parsedContent} />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-8 py-8">
                  <div className="text-muted-foreground">File is not yet parsed</div>
                  <Link href={`/parse/${file.id}`}>
                    <Button size="sm">Parse File</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </HubLayout>
  )
}
