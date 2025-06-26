"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fileToDataUrl, validateFile, formatFileSize, isImageFile, isPdfFile } from "@/lib/utils/file-utils"
import { X, File, ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FileUploadProps {
    onFilesChange: (files: UploadedFile[]) => void
    maxFiles?: number
    maxFileSize?: number // in bytes
    maxTotalSize?: number // in bytes
    acceptedFileTypes?: string[]
    disabled?: boolean
    className?: string
    // Customizable text
    title?: string
    description?: string
    dragActiveText?: string
    clickText?: string
}

export interface UploadedFile {
    id: string
    file: File
    preview?: string
    dataUrl?: string
    error?: string
}

export interface FilePreviewProps {
    file: UploadedFile
    onRemove: (id: string) => void
}

export function FileUpload({
    onFilesChange,
    maxFiles = 1,
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    maxTotalSize,
    acceptedFileTypes,
    disabled = false,
    className,
    title = "Upload files",
    description = "Drag and drop files here, or click to select files",
    dragActiveText = "Drop files here...",
    clickText = "Choose files",
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragActive, setIsDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const processFiles = useCallback(
        async (fileList: FileList | File[]) => {
            const newFiles: UploadedFile[] = []
            const filesArray = Array.from(fileList)

            // Check if adding these files would exceed maxFiles
            if (files.length + filesArray.length > maxFiles) {
                alert(`Maximum ${maxFiles} file(s) allowed`)
                return
            }

            // Check total size if specified
            if (maxTotalSize) {
                const currentTotalSize = files.reduce((sum, f) => sum + f.file.size, 0)
                const newTotalSize = filesArray.reduce((sum, f) => sum + f.size, 0)
                if (currentTotalSize + newTotalSize > maxTotalSize) {
                    alert(`Total file size cannot exceed ${formatFileSize(maxTotalSize)}`)
                    return
                }
            }

            for (const file of filesArray) {
                const id = Math.random().toString(36).substring(7)
                const error = validateFile(file, acceptedFileTypes, maxFileSize)

                let preview: string | undefined
                let dataUrl: string | undefined

                try {
                    dataUrl = await fileToDataUrl(file)
                    if (file.type.startsWith("image/")) {
                        preview = dataUrl
                    }
                } catch (err) {
                    console.error("Error processing file:", err)
                }

                newFiles.push({
                    id,
                    file,
                    preview,
                    dataUrl,
                    error: error || undefined,
                })
            }

            const updatedFiles = [...files, ...newFiles]
            setFiles(updatedFiles)
            onFilesChange(updatedFiles)
        },
        [files, maxFiles, maxFileSize, maxTotalSize, acceptedFileTypes, onFilesChange],
    )

    const removeFile = useCallback(
        (id: string) => {
            const updatedFiles = files.filter((f) => f.id !== id)
            setFiles(updatedFiles)
            onFilesChange(updatedFiles)
        },
        [files, onFilesChange],
    )

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (!disabled) {
                setIsDragActive(true)
            }
        },
        [disabled],
    )

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragActive(false)

            if (disabled) return

            const droppedFiles = e.dataTransfer.files
            if (droppedFiles.length > 0) {
                processFiles(droppedFiles)
            }
        },
        [disabled, processFiles],
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files
            if (selectedFiles && selectedFiles.length > 0) {
                processFiles(selectedFiles)
            }
            // Reset input value to allow selecting the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        },
        [processFiles],
    )

    const handleClick = useCallback(() => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }, [disabled])

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            if (disabled) return

            const items = e.clipboardData.items
            const files: File[] = []

            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                if (item.kind === "file") {
                    const file = item.getAsFile()
                    if (file) {
                        files.push(file)
                    }
                }
            }

            if (files.length > 0) {
                processFiles(files)
            }
        },
        [disabled, processFiles],
    )

    const clearAll = useCallback(() => {
        setFiles([])
        onFilesChange([])
    }, [onFilesChange])

    return (
        <div className={cn("w-full", className)}>
            {/* Upload Area */}
            <Card
                className={cn(
                    "border-2 border-dashed transition-all duration-200",
                    isDragActive && "border-primary bg-primary/5 scale-[1.02]",
                    disabled && "opacity-50 cursor-not-allowed",
                    !disabled && files.length === 0 && "hover:border-muted-foreground/50 cursor-pointer",
                    files.length > 0 && "border-border",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onPaste={handlePaste}
                tabIndex={0}
            >
                <CardContent className="p-6">
                    {files.length === 0 ? (
                        // Empty state - minimal and clean
                        <div className="flex flex-col items-center justify-center text-center py-12" onClick={handleClick}>
                            <Upload
                                className={cn("h-8 w-8 mb-3 text-muted-foreground transition-colors", isDragActive && "text-primary")}
                            />
                            <p className="text-sm text-muted-foreground">{isDragActive ? dragActiveText : description}</p>
                        </div>
                    ) : (
                        // Files uploaded state - clean preview
                        <div className="space-y-3">
                            {files.map((file) => (
                                <FilePreview key={file.id} file={file} onRemove={removeFile} />
                            ))}

                            {files.length < maxFiles && (
                                <div
                                    className="flex items-center justify-center py-4 border border-dashed border-muted-foreground/25 rounded-md hover:border-muted-foreground/50 transition-colors cursor-pointer"
                                    onClick={handleClick}
                                >
                                    <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Add more files</span>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple={maxFiles > 1}
                accept={acceptedFileTypes?.join(",")}
                onChange={handleFileInput}
                className="hidden"
                disabled={disabled}
            />
        </div>
    )
}





export function FilePreview({ file, onRemove }: FilePreviewProps) {
    const getFileIcon = () => {
        if (isImageFile(file.file)) return <ImageIcon className="h-4 w-4" />
        if (isPdfFile(file.file)) return <FileText className="h-4 w-4" />
        return <File className="h-4 w-4" />
    }

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
            {/* Preview */}
            <div className="flex-shrink-0">
                {isImageFile(file.file) && file.preview ? (
                    <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="h-10 w-10 rounded object-cover"
                    />
                ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                        {getFileIcon()}
                    </div>
                )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.file.size)}</p>
                {file.error && <p className="text-xs text-destructive mt-1">{file.error}</p>}
            </div>

            {/* Remove Button */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove(file.id)
                }}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
            </Button>
        </div>
    )
}

