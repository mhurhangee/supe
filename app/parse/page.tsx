'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload'
import { ParsedContent } from '@/components/ui/parsed-content'
import { Skeleton } from '@/components/ui/skeleton'

import { HubLayout } from '@/components/hub-layout'

import { FileCode, Loader2 } from 'lucide-react'

export default function ParsePdfPage() {
  const [uploadedPDFFile, setUploadedPDFFile] = useState<UploadedFile[]>([])
  const [parsedContent, setParsedContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileUploadKey, setFileUploadKey] = useState<number>(0)

  const handleParsePdf = async () => {
    if (uploadedPDFFile.length === 0) return

    setIsLoading(true)
    setError(null)
    setParsedContent('')

    try {
      const formData = new FormData()
      formData.append('file', uploadedPDFFile[0].file)

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse PDF')
      }

      setParsedContent(data.content)
    } catch (err) {
      console.error('Error parsing PDF:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <HubLayout
      title="Parse PDF"
      description="Upload a PDF file and parse it into markdown."
      icon={<FileCode />}
    >
      <div className="flex flex-col gap-6">
        <div className="mx-auto flex w-[300px]">
          <FileUpload
            key={fileUploadKey} // Add key prop to force re-render when cleared
            onFilesChange={setUploadedPDFFile}
            maxFiles={1}
            maxFileSize={5 * 1024 * 1024} // 5MB
            acceptedFileTypes={['.pdf']}
            title="Upload a PDF of a patent or application"
            description="Drag & drop or click to upload"
          />
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={handleParsePdf} disabled={isLoading || uploadedPDFFile.length === 0}>
            {isLoading ? 'Parsing...' : 'Parse PDF'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setUploadedPDFFile([])
              setIsLoading(false)
              setParsedContent('')
              setError(null)
              setFileUploadKey(prev => prev + 1) // Increment key to force FileUpload to reset
            }}
          >
            Clear
          </Button>
        </div>

        {error && <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

        {parsedContent && <ParsedContent content={parsedContent} />}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Card className="w-full max-w-md p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
                <p className="animate-pulse text-lg font-medium">Processing your PDF...</p>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </HubLayout>
  )
}
