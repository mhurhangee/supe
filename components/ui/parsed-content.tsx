import { Card } from '@/components/ui/card'
import { CopyToClipboardButton } from '@/components/ui/copy-to-clipboard-button'
import { DownloadButton } from '@/components/ui/download-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Markdown } from '@/components/markdown'

export const ParsedContent = ({ content }: { content: string }) => {
  return (
    <Tabs defaultValue="parsed-content">
      <TabsList>
        <TabsTrigger value="parsed-content">Parsed Content</TabsTrigger>
        <TabsTrigger value="raw-content">Raw Content</TabsTrigger>
      </TabsList>
      <TabsContent value="parsed-content">
        <Card className="p-4">
          <div className="flex justify-end gap-2">
            <CopyToClipboardButton content={content} />
            <DownloadButton content={content} />
          </div>
          <div className="prose max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="raw-content">
        <Card className="p-4">
          <div className="flex justify-end gap-2">
            <CopyToClipboardButton content={content} />
            <DownloadButton content={content} />
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
