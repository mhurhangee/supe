import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File
    const roomType = formData.get("roomType") as string
    const designStyle = formData.get("designStyle") as string
    const additionalPrompt = formData.get("additionalPrompt") as string

    if (!image || !roomType || !designStyle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Processing request:", { roomType, designStyle, imageSize: image.size })

    // Convert the uploaded file to buffer
    const imageBuffer = await image.arrayBuffer()
    const uint8Array = new Uint8Array(imageBuffer)

    // Create a File object for OpenAI
    const imageFile = new File([uint8Array], image.name, {
      type: image.type,
    })

    // Create the prompt for room redesign
    let prompt = `You are an expert interior designer. Redesign the image of the room to be a ${roomType.toLowerCase()} in a ${designStyle.toLowerCase()} style. `
    prompt += `Keep the room's basic structure and layout, but update the furniture, decor, colors, and styling to match the ${designStyle.toLowerCase()} aesthetic. Make sure the room contains all the necessary furniture and decor, e.g. if the room is a bedroom, make sure it contains a bed, nightstand, dresser, closet and lighting.`
    prompt += `Make the room look professionally designed and cohesive. Be careful to not distort the room's basic structure and layout. You are filling the room with a new design, furniture and decor.`

    if (additionalPrompt) {
      prompt += ` Additional instructions: ${additionalPrompt}`
    }

    console.log("Generated prompt:", prompt)

    // Call OpenAI's image edit API
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: prompt,
      output_format: "png",
      size: "auto",
      quality: "auto",
      n: 1,
    })

    console.log("OpenAI response received")

    // The response will contain base64 encoded image data
    const imageData = response.data?.[0].b64_json

    if (!imageData) {
      return NextResponse.json({ error: "No image data received from OpenAI" }, { status: 500 })
    }

    // Convert base64 to data URL for display
    const imageUrl = `data:image/png;base64,${imageData}`

    return NextResponse.json({
      success: true,
      imageUrl,
      usage: response.usage,
    })
  } catch (error: any) {
    console.error("Detailed error generating room design:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    })

    // Provide more specific error messages
    let errorMessage = "Failed to generate room design"
    let statusCode = 500

    if (error.message?.includes("API key")) {
      errorMessage = "Invalid API key configuration"
      statusCode = 401
    } else if (error.message?.includes("quota") || error.message?.includes("billing")) {
      errorMessage = "API quota exceeded. Please check your OpenAI billing."
      statusCode = 402
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Rate limit exceeded. Please wait a moment and try again."
      statusCode = 429
    } else if (error.message?.includes("image") || error.message?.includes("file")) {
      errorMessage = "Invalid image format. Please use PNG, JPG, or WebP under 50MB."
      statusCode = 400
    } else if (error.code === "insufficient_quota") {
      errorMessage = "OpenAI API quota exceeded. Please check your account billing."
      statusCode = 402
    }

    // Always return JSON response
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: statusCode },
    )
  }
}
