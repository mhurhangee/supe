"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2, Sparkles, Bath, Loader2Icon } from "lucide-react"
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

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
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

            const response = await fetch("/api/room-designer", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`)
            }

            setResultImage(data.imageUrl)
        } catch (error: any) {
            alert(`Failed to generate room design: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <main className="superfier-container container">
                <h1 className="superfier-title">
                    <Bath className="h-10 w-10" /> Room Designer
                </h1>
                <p className="superfier-subtitle">Transform your space with AI-powered interior design</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Your Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <label htmlFor="image-upload"
                                className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-background ${imagePreview
                                        ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                                        : "border-muted hover:border-accent"
                                    }`}
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
                                                Click to upload a room image
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
                            disabled={!selectedImage || !roomType || !designStyle || isLoading}
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
                            }}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    </div>
                </form>

                {/* Result */}
                {resultImage ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Redesigned Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full max-w-2xl mx-auto">
                                <img
                                    src={resultImage}
                                    alt="Redesigned room"
                                    className="rounded-lg object-cover w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>You're room will appear here</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full max-w-2xl mx-auto">
                                {isLoading ? (
                                    <p className="">Designing your room</p>
                                ) : (
                                    <p>Once you submit the form, your room will appear here</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </Layout>
    )
}
