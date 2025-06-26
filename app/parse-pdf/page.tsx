'use client'

import { FileCode } from 'lucide-react'
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ParsePdfPage() {
    const [uploadedPDFFile, setUploadedPDFFile] = useState<UploadedFile[]>([])
    const [parsedContent, setParsedContent] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
        <main className="superfier-container container">
            <h1 className="superfier-title">
                <FileCode className="h-10 w-10" /> Parse PDF
            </h1>
            <p className="superfier-subtitle">Upload a PDF file and we will parse it for you.</p>
            
            <div className="grid gap-6">
                <FileUpload
                    onFilesChange={setUploadedPDFFile}
                    maxFiles={1}
                    maxFileSize={5 * 1024 * 1024} // 5MB
                    acceptedFileTypes={[".pdf"]}
                    title="Upload a PDF of a patent or application"
                    description="Drag & drop or click to upload"
                />
                
                <Button
                    onClick={handleParsePdf}
                    disabled={isLoading || uploadedPDFFile.length === 0}
                    className="w-full"
                >
                    {isLoading ? 'Parsing...' : 'Parse PDF'}
                </Button>
                
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                
                {parsedContent && (
                    <Card className="p-4 overflow-auto max-h-[60vh]">
                        <h2 className="text-xl font-semibold mb-4">Parsed Content</h2>
                        <div className="prose max-w-none">
                            {/* Use a pre tag for preserving whitespace */}
                            <pre className="whitespace-pre-wrap">{parsedContent}</pre>
                        </div>
                    </Card>
                )}
            </div>
        </main>
    )
}