'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import type { UploadedFile } from '@/lib/types/files'
import { fetcher } from '@/lib/utils'

import { Check, FileText, X } from 'lucide-react'
import useSWR from 'swr'

interface FileSelectorProps {
  selectedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export function FileSelector({ selectedFiles, onFilesChange }: FileSelectorProps) {
  const { data, error, isLoading } = useSWR<{ files: UploadedFile[] }>('/api/file', fetcher)
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  // Filter files based on search query
  const filteredFiles =
    data?.files?.filter(
      file =>
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || []

  // Check if a file is selected
  const isSelected = (file: UploadedFile) =>
    selectedFiles.some(selectedFile => selectedFile.id === file.id)

  // Toggle file selection
  const toggleFile = (file: UploadedFile) => {
    if (isSelected(file)) {
      onFilesChange(selectedFiles.filter(selectedFile => selectedFile.id !== file.id))
    } else {
      onFilesChange([...selectedFiles, file])
    }
  }

  // Clear all selected files
  const clearSelection = () => {
    onFilesChange([])
  }

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label="Select files"
          >
            <FileText className="h-4 w-4" />
            {selectedFiles.length > 0 && (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                {selectedFiles.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" side="top">
          <div className="border-b p-2">
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <ScrollArea className="max-h-72 overflow-y-auto">
            <div className="p-2">
              {isLoading ? (
                <div className="text-muted-foreground p-2 text-sm">Loading files...</div>
              ) : error ? (
                <div className="text-destructive p-2 text-sm">Error loading files</div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-muted-foreground p-2 text-sm">
                  {data?.files?.length === 0 ? 'No files found' : 'No matching files'}
                </div>
              ) : (
                filteredFiles.map(file => (
                  <div
                    key={file.id}
                    className={`flex cursor-pointer items-center justify-between rounded-md p-2 ${
                      isSelected(file) ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleFile(file)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.title}</span>
                    </div>
                    {isSelected(file) && <Check className="text-primary h-4 w-4" />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full text-xs"
              onClick={clearSelection}
              disabled={selectedFiles.length === 0}
            >
              Clear selection
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function FileChips({
  selectedFiles,
  onRemove,
  readOnly = false,
}: {
  selectedFiles: UploadedFile[]
  onRemove: (file: UploadedFile) => void
  readOnly?: boolean
}) {
  if (selectedFiles.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 p-1">
      {selectedFiles.map(file => (
        <Badge key={file.id} variant="secondary" className="flex max-w-[200px] items-center gap-1">
          <FileText className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{file.title}</span>
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted ml-1 h-4 w-4 p-0"
              onClick={() => onRemove(file)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  )
}
