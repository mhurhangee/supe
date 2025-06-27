import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { FileActions } from '@/components/file-actions'

import type { File } from '@/lib/types/files'
import { formatDate } from '@/lib/utils'

import { ArrowRight, CalendarDays, FileText } from 'lucide-react'

interface FilesListProps {
  files?: File[]
  isLoading?: boolean
  viewMode?: 'grid' | 'list'
}

export function FilesList({ files, isLoading, viewMode = 'grid' }: FilesListProps) {
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

  if (!files?.length) {
    return <div className="text-muted-foreground col-span-2 py-8 text-center">No files found.</div>
  }

  if (viewMode === 'list') {
    // Simple list view
    return (
      <div className="flex flex-col gap-2">
        {files.map(file => (
          <div
            key={file.id}
            className="group bg-card flex items-center gap-4 rounded border px-4 py-3 hover:shadow"
          >
            <FileText className="text-muted-foreground h-4 w-4" />
            <div className="flex-1">
              <Link href={`/files/${file.id}`} className="font-medium hover:underline">
                {file.title}
              </Link>
              <div className="text-muted-foreground line-clamp-1 text-xs">
                {file.description ?? 'No description'}
              </div>
            </div>
            <div className="flex min-w-[120px] flex-col items-end gap-2">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <CalendarDays className="h-3 w-3" />
                {formatDate(file.createdAt)}
              </span>
              <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <FileActions file={file} />
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
      {files.map(file => (
        <Card key={file.id} className="group relative transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-4 w-4" />
              <Link href={`/files/${file.id}`} className="flex items-center gap-2">
                {file.title}
                <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground line-clamp-2 flex items-center gap-2 text-sm">
              <FileText className="text-muted-foreground h-4 w-4" />
              {file.description ?? 'No description'}
            </p>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(file.createdAt)}</span>
            </div>
            <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <FileActions file={file} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
