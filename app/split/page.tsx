import { Layout } from "@/components/layout"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SplitPage() {
    return (
        <Layout>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="container">
                    <Card className="h-full m-2">
                        <CardHeader className="bg-green-500">
                            <CardTitle>Left</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-red-500">
                            Blah
                        </CardContent>
                        <CardFooter className="mt-auto shrink-0 p-4 bg-yellow-500">
                            Footer
                        </CardFooter>
                    </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <Card className="h-full m-2">
                        <CardHeader className="bg-green-500">
                            <CardTitle>Right</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-red-500">
                            Blah
                        </CardContent>
                        <CardFooter className="bg-yellow-500">
                            Footer
                        </CardFooter>
                    </Card>
                </ResizablePanel>
            </ResizablePanelGroup>
        </Layout>
    )
}