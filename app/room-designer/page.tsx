"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2, Sparkles } from "lucide-react"
import Image from "next/image"
import { Layout } from "@/components/layout"

const ROOM_TYPES = [
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
    "Dining Room",
    "Home Office",
    "Nursery",
    "Guest Room",
]

const DESIGN_STYLES = [
    "Modern",
    "Minimalist",
    "Scandinavian",
    "Industrial",
    "Bohemian",
    "Traditional",
    "Contemporary",
    "Rustic",
    "Art Deco",
    "Mid-Century Modern",
]

export default function RoomDesigner() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [roomType, setRoomType] = useState<string>("")
    const [designStyle, setDesignStyle] = useState<string>("")
    const [additionalPrompt, setAdditionalPrompt] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [resultImage, setResultImage] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [aspectRatioError, setAspectRatioError] = useState<string | null>(null)

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            // Check aspect ratio before setting
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new window.Image()
                img.onload = () => {
                    const width = img.width
                    const height = img.height
                    const ratio = width / height
                    // Allow 1:1 or 1.5:1 or 1:1.5 (portrait/landscape)
                    const isSquare = Math.abs(ratio - 1) < 0.05
                    const isLandscape = Math.abs(ratio - 1.5) < 0.05
                    const isPortrait = Math.abs(ratio - (1 / 1.5)) < 0.05
                    if (isSquare || isLandscape || isPortrait) {
                        setAspectRatioError(null)
                        setSelectedImage(file)
                        setImagePreview(e.target?.result as string)
                    } else {
                        setAspectRatioError("Only square (1:1) or 1.5 (landscape or portrait) images are allowed.")
                        setSelectedImage(null)
                        setImagePreview(null)
                    }
                }
                if (typeof e.target?.result === "string") {
                    img.src = e.target.result
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedImage || !roomType || !designStyle) return

        setIsLoading(true)
        setResultImage(null)

        try {
            const formData = new FormData()
            formData.append("image", selectedImage)
            formData.append("roomType", roomType)
            formData.append("designStyle", designStyle)
            formData.append("additionalPrompt", additionalPrompt)

            console.log("Submitting form with:", { roomType, designStyle, imageSize: selectedImage.size })

            const response = await fetch("/api/design-room", {
                method: "POST",
                body: formData,
            })

            // Check if response is JSON
            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text()
                console.error("Non-JSON response:", textResponse)
                throw new Error("Server returned an invalid response. Please try again.")
            }

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`)
            }

            console.log("Design generated successfully")
            setResultImage(data.imageUrl)
        } catch (error: any) {
            console.error("Error:", error)

            // Show more user-friendly error messages
            let userMessage = error.message
            if (error.message.includes("fetch")) {
                userMessage = "Network error. Please check your connection and try again."
            } else if (error.message.includes("JSON")) {
                userMessage = "Server error. Please try again in a moment."
            }

            alert(`Failed to generate room design: ${userMessage}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <main className="container max-w-2xl py-8">
                <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground mb-2">
                    <Sparkles className="h-8 w-8 text-primary" /> Room Designer
                </h1>
                <p className="text-muted-foreground mb-6">Transform your space with AI-powered interior design</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Your Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <label htmlFor="image-upload"
                                className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-background ${dragActive
                                    ? "border-primary/70 bg-primary/5"
                                    : imagePreview
                                        ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                                        : "border-muted hover:border-accent"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {imagePreview ? (
                                    <div className="space-y-4">
                                        <div className="relative w-full aspect-square max-w-xs mx-auto bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Room preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedImage(null)
                                                    setImagePreview(null)
                                                    setAspectRatioError(null)
                                                }}
                                            >
                                                Remove Image
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                Change Image
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                                        <div>
                                            <p className="text-lg font-medium text-foreground">
                                                Drop your room image here, or click to browse
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WebP up to 50MB</p>
                                        </div>
                                        <Button type="button" variant="outline" asChild>
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                Browse Files
                                            </label>
                                        </Button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleImageUpload(e.target.files[0])
                                        }
                                    }}
                                    className="hidden"
                                    id="image-upload"
                                />
                            </label>
                            {aspectRatioError && (
                                <p className="text-sm text-destructive mt-2">{aspectRatioError}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Design Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Design Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="room-type">Room Type</Label>
                                    <Select value={roomType} onValueChange={setRoomType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select room type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROOM_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="design-style">Design Style</Label>
                                    <Select value={designStyle} onValueChange={setDesignStyle}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select design style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DESIGN_STYLES.map((style) => (
                                                <SelectItem key={style} value={style}>
                                                    {style}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="additional-prompt">Additional Requirements (Optional)</Label>
                                <Textarea
                                    id="additional-prompt"
                                    placeholder="e.g., Include a reading nook, use warm colors, add plants..."
                                    value={additionalPrompt}
                                    onChange={(e) => setAdditionalPrompt(e.target.value)}
                                    className="min-h-20"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={!selectedImage || !roomType || !designStyle || isLoading || !!aspectRatioError}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Designing Your Room...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Design
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                                setSelectedImage(null)
                                setImagePreview(null)
                                setRoomType("")
                                setDesignStyle("")
                                setAdditionalPrompt("")
                                setResultImage(null)
                                setAspectRatioError(null)
                            }}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    </div>
                </form>

                {/* Result */}
                {resultImage && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Redesigned Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full max-w-2xl mx-auto">
                                <Image
                                    src={resultImage || "/placeholder.svg"}
                                    alt="Redesigned room"
                                    width={800}
                                    height={600}
                                    className="rounded-lg object-cover w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </Layout>
    )
}
