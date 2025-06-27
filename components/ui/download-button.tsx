import { Button } from '@/components/ui/button'

import { Download } from 'lucide-react'
import { toast } from 'sonner'

export function DownloadButton({ content }: { content: string }) {
  const handleDownload = (content: string) => {
    // Create a blob from the content
    const blob = new Blob([content], { type: 'text/plain' })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const a = document.createElement('a')
    a.href = url
    a.download = `parsed-content-${new Date().toISOString().slice(0, 10)}.txt`

    // Append to the document, click it, and remove it
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Release the URL object
    URL.revokeObjectURL(url)

    toast.success('File downloaded', {
      description: 'Your content has been downloaded',
    })
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDownload(content)}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
    </Button>
  )
}
