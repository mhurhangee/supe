'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ListToolbar } from '@/components/ui/list-toolbar'

import { FileUploadDialog } from '@/components/file-upload-dialog'
import { FilesList } from '@/components/files-list'
import { HubLayout } from '@/components/hub-layout'

import type { UploadedFile } from '@/lib/types/files'
import { fetcher } from '@/lib/utils'

import { FileIcon } from 'lucide-react'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

export default function FilesPage() {
  const { data, error, isLoading } = useSWR<{ files: UploadedFile[] }>('/api/file', fetcher)

  // Toolbar state
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'title' | 'updatedAt'>('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (error) toast.error('Failed to load files')
  }, [error])

  // Filtering and sorting logic
  const filteredFiles = useMemo(() => {
    if (!data?.files) return []
    let result = data.files
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        f =>
          f.title.toLowerCase().includes(q) || (f.description?.toLowerCase().includes(q) ?? false)
      )
    }
    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sort === 'title') cmp = a.title.localeCompare(b.title)
      else if (sort === 'updatedAt')
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return result
  }, [data?.files, search, sort, sortOrder])

  return (
    <HubLayout
      title={<span className="flex items-center gap-2">Files</span>}
      description="Manage your uploaded filesaaa."
      icon={<FileIcon className="h-5 w-5" />}
      actions={
        <FileUploadDialog onUploaded={() => mutate('/api/file')}>
          <Button size="sm">Upload File</Button>
        </FileUploadDialog>
      }
    >
      <div className="mt-8 mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <ListToolbar
          search={search}
          onSearch={setSearch}
          sort={sort}
          sortOrder={sortOrder}
          onSort={v => setSort(v as 'title' | 'updatedAt')}
          onToggleSortOrder={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
          sortOptions={[
            { value: 'updatedAt', label: 'Last Updated' },
            { value: 'title', label: 'Title' },
          ]}
        />
      </div>
      <FilesList files={filteredFiles} isLoading={isLoading} />
    </HubLayout>
  )
}
