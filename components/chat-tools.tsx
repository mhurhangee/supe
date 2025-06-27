'use client'

import type { UploadedFile } from '@/lib/types/files'

import { Bug, Globe } from 'lucide-react'

import { FileSelector } from './file-selector'
import { Toggle } from './ui/toggle'

export const ChatTools = ({
  toolWeb,
  setToolWeb,
  debug,
  setDebug,
  selectedFiles,
  onFilesChange,
}: {
  toolWeb: boolean
  setToolWeb: (value: boolean) => void
  debug: boolean
  setDebug: (value: boolean) => void
  selectedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Toggle pressed={toolWeb} onPressedChange={setToolWeb} className="z-10 rounded-full">
        <Globe className="h-4 w-4" />
      </Toggle>
      <Toggle pressed={debug} onPressedChange={setDebug} className="z-10 rounded-full">
        <Bug className="h-4 w-4" />
      </Toggle>
      <FileSelector selectedFiles={selectedFiles} onFilesChange={onFilesChange} />
    </div>
  )
}
