import { put } from '@vercel/blob'

import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db/drizzle'
import { files } from '@/lib/db/schema'
import { FileUploadSchema } from '@/lib/types/files'
import {
  HTTP_STATUS,
  createErrorResponse,
  genId,
  getLlamaCloudApiKey,
  getUserId,
  isPdfFile,
  parseFile,
  parseIO,
} from '@/lib/utils'

import { and, eq } from 'drizzle-orm'

export const runtime = 'edge'

// Get all files for the authenticated user
export async function GET(req: NextRequest) {
  try {
    // Auth user or throw error
    const userId = await getUserId()

    // Get project filter from query params if present
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    // Execute query with appropriate conditions
    let userFiles
    if (projectId) {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.projectId, projectId)))
    } else {
      userFiles = await db.select().from(files).where(eq(files.userId, userId))
    }

    // Return success response and files
    return NextResponse.json({ files: userFiles, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Internal server error', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}

// Create a new file for the authenticated user
export async function POST(req: NextRequest) {
  try {
    // Auth user or throw error
    const userId = await getUserId()

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('No file uploaded')
    }

    // Get metadata from form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const projectId = formData.get('projectId') as string

    let parsedContent = ''
    if (isPdfFile(file)) {
      const apiKey = getLlamaCloudApiKey()
      parsedContent = await parseFile(file, apiKey)
    }

    // Validate metadata
    const {
      title: validTitle,
      description: validDescription,
      projectId: validProjectId,
      parsedContent: validParsedContent,
    } = parseIO(FileUploadSchema, {
      title,
      description,
      projectId: projectId || undefined,
      parsedContent: parsedContent,
    })

    // Generate unique ID for the file
    const id = genId()

    // Upload to Vercel Blob
    const blob = await put(`${userId}/${id}-${file.name}`, file, {
      access: 'public',
    })

    // Create new file record in database
    const [newFile] = await db
      .insert(files)
      .values({
        id,
        userId,
        projectId: validProjectId,
        title: validTitle,
        description: validDescription,
        url: blob.url,
        parsedContent: validParsedContent,
      })
      .returning()

    // Return success response and file
    return NextResponse.json({ file: newFile, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to upload file', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}
