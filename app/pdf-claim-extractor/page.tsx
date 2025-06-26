'use client'

import { ScanText } from 'lucide-react'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'

export default function ClaimExtractorPage() {
    const [uploadedPDFFile, setUploadedPDFFile] = useState<UploadedFile[]>([])
    const transport = new DefaultChatTransport({
        api: '/api/pdf-claim-extract',
    })

    const { messages, setMessages, sendMessage, status, stop } = useChat({
        transport,
    })
    useEffect(() => {
        console.log(messages)
    }, [messages])

    return (
        <main className="superfier-container container">
            <h1 className="superfier-title">
                <ScanText className="h-10 w-10" /> PDF Claim Extractor
            </h1>
            <p className="superfier-subtitle">Extract claims from patents.</p>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="container">
                    <Card className="m-2 flex flex-col">
                        <CardHeader>
                            <CardTitle>Upload PDF</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <FileUpload
                                onFilesChange={setUploadedPDFFile}
                                maxFiles={1}
                                maxFileSize={5 * 1024 * 1024} // 5MB
                                acceptedFileTypes={[".pdf"]}
                                title="Upload a PDF of a patent or application"
                                description="Drag & drop or click to upload"
                            />
                        </CardContent>
                        <CardFooter className="shrink-0 p-4">
                            <div className="flex flex-row">
                                <Button
                                    onClick={() => sendMessage(
                                        { role: 'user', parts: [{ type: 'text', text: 'Summarise' }, { type: 'file', mediaType: 'application/pdf', url: uploadedPDFFile[0].dataUrl || '', filename: uploadedPDFFile[0].file.name }] }
                                    )}
                                    disabled={status !== 'ready' || uploadedPDFFile.length === 0}
                                    className="w-full"
                                >
                                    Summarise PDF
                                </Button>
                                <Button
                                    onClick={() => { setMessages([]), setUploadedPDFFile([]) }}
                                    disabled={status !== 'ready'}
                                    className="w-full"
                                >
                                    Reset
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <Card className="m-2 flex flex-col">
                        <CardHeader>
                            <CardTitle>See the claims</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {messages.map((message, i) => (
                                <div key={i} className="mb-4 border-b pb-2">
                                    <p><strong>Role:</strong> {message.role}</p>
                                    {message.parts.map((part, j) => (
                                        <div key={j} className="ml-4 mt-2">
                                            <p><strong>Type:</strong> {part.type}</p>
                                            {part.type === 'text' && (
                                                <p><strong>Text:</strong> {part.text.length > 100 ?
                                                    `${part.text.substring(0, 100)}...` : part.text}</p>
                                            )}
                                            {part.type === 'file' && (
                                                <>
                                                    <p><strong>Media Type:</strong> {part.mediaType}</p>
                                                    <p><strong>Filename:</strong> {part.filename}</p>
                                                    <p><strong>URL:</strong> {part.url.length > 100 ?
                                                        `${part.url.substring(0, 100)}...` : part.url}</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="shrink-0 p-4">Footer</CardFooter>
                    </Card>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}
