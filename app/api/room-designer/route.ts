import { NextRequest, NextResponse } from 'next/server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const roomType = formData.get('roomType') as string
    const designStyle = formData.get('designStyle') as string
    const additionalPrompt = formData.get('additionalPrompt') as string

    if (!image || !roomType || !designStyle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert the uploaded file to buffer
    const imageBuffer = await image.arrayBuffer()
    const uint8Array = new Uint8Array(imageBuffer)

    // Create a File object for OpenAI
    const imageFile = new File([uint8Array], image.name, {
      type: image.type,
    })

    // Create the prompt for room redesign
    let prompt = `\
- You are an expert stager for an estate agent in the UK. 
- Please stage the room as a ${roomType.toLowerCase()} in a ${designStyle.toLowerCase()}.
- You may add or remove furnishings and decor.
- HOWEVER, YOU MUST KEEP THE SAME STRUCTURE AND LAYOUT OF THE ROOM..
- YOU MUST KEEP THE position of doors, windows or the size of the room.
- ONLY add or remove furniture and decor to the room.`

    if (additionalPrompt) {
      prompt += ` Additional instructions: ${additionalPrompt}`
    }

    // Call OpenAI's image edit API
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt: prompt,
      output_format: 'png',
      size: 'auto',
      quality: 'auto',
      n: 1,
    })

    // The response will contain base64 encoded image data
    const imageData = response.data?.[0].b64_json

    if (!imageData) {
      return NextResponse.json({ error: 'No image data received from OpenAI' }, { status: 500 })
    }

    // Convert base64 to data URL for display
    const imageUrl = `data:image/png;base64,${imageData}`

    return NextResponse.json({
      success: true,
      imageUrl,
    })
  } catch {
    console.error('Detailed error generating room design:')
    return NextResponse.json({ error: 'An unknown error occured' }, { status: 400 })
  }
}
