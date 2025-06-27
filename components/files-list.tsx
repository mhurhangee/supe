import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { FileActions } from '@/components/file-actions'

import type { UploadedFile } from '@/lib/types/files'
import { formatDate } from '@/lib/utils'

import { ArrowRight, CalendarDays, FileText } from 'lucide-react'

interface FilesListProps {
  files?: UploadedFile[]
  isLoading?: boolean
}

export function FilesList({ files, isLoading }: FilesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (!files?.length) {
    return <div className="text-muted-foreground col-span-2 py-8 text-center">No files found.</div>
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
            <CardDescription>{file.description || 'No description'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(file.createdAt)}</span>
              </div>
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <FileActions file={file} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
