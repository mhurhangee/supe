import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default function SplitPage() {
  return (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="container">
          <Card className="m-2 flex h-full flex-col">
            <CardHeader className="bg-green-500">
              <CardTitle>Left</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 bg-red-500">Blah</CardContent>
            <CardFooter className="shrink-0 bg-yellow-500 p-4">Footer</CardFooter>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <Card className="m-2 flex h-full flex-col">
            <CardHeader className="bg-green-500">
              <CardTitle>Right</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 bg-red-500">Blah</CardContent>
            <CardFooter className="shrink-0 bg-yellow-500 p-4">Footer</CardFooter>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
  )
}
