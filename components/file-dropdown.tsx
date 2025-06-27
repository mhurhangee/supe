import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { UploadedFile } from '@/lib/types/files'
import { fetcher } from '@/lib/utils'

import { FileText } from 'lucide-react'
import useSWR from 'swr'

export const FileDropdown = ({
  selectedFile,
  onFileSelect,
  onClearSelection,
}: {
  selectedFile?: UploadedFile | null
  onFileSelect?: (file: UploadedFile | null) => void
  onClearSelection?: () => void
}) => {
  const { data, error, isLoading } = useSWR<{ files: UploadedFile[] }>('/api/file', fetcher)

  const handleFileSelect = (file: UploadedFile) => {
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleClearSelection = () => {
    if (onClearSelection) {
      onClearSelection()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <FileText className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="max-h-96 w-64 overflow-y-auto">
        <DropdownMenuLabel>
          {selectedFile ? `Selected: ${selectedFile.title}` : 'Select a file'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>Loading files...</DropdownMenuItem>
        ) : error ? (
          <DropdownMenuItem disabled>Error loading files</DropdownMenuItem>
        ) : data?.files?.length === 0 ? (
          <DropdownMenuItem disabled>No files found</DropdownMenuItem>
        ) : (
          <>
            {selectedFile && (
              <>
                <DropdownMenuItem onClick={handleClearSelection}>Clear selection</DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {data?.files?.map(file => (
              <DropdownMenuItem key={file.id} onClick={() => handleFileSelect(file)}>
                {file.title}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
