import { del } from '@vercel/blob'

import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db/drizzle'
import { files } from '@/lib/db/schema'
import { FileUpdateSchema } from '@/lib/types/files'
import { ApiError, HTTP_STATUS, createErrorResponse, getUserId, parseIO } from '@/lib/utils'

import { and, eq } from 'drizzle-orm'

export const runtime = 'edge'

// Get a single file by id for the authenticated user
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user or throw error
    const userId = await getUserId()
    const id = (await params).id

    // Get file by id and user
    const file = await db.query.files.findFirst({
      where: (f, { eq, and }) => and(eq(f.id, id), eq(f.userId, userId)),
    })

    if (!file) {
      throw new ApiError('File not found or access denied', HTTP_STATUS.NOT_FOUND)
    }

    // Return success response and file
    return NextResponse.json({ file, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to get file', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}

// Update a file by id for the authenticated user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user or throw error
    const userId = await getUserId()
    const id = (await params).id

    // Parse request body or throw error
    const { title, description } = parseIO(FileUpdateSchema, await req.json())

    // Build update data
    const updateData = {
      ...Object.fromEntries(
        Object.entries({ title, description }).filter(([, v]) => v !== undefined)
      ),
      updatedAt: new Date(),
    }

    // Update file
    const updated = await db
      .update(files)
      .set(updateData)
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .returning()

    if (updated.length === 0) {
      throw new ApiError('File not found or access denied', HTTP_STATUS.NOT_FOUND)
    }

    // Return success response and updated file
    const file = updated[0]

    return NextResponse.json({ file, success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to update file', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}

// Delete a file by id for the authenticated user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user or throw error
    const userId = await getUserId()
    const id = (await params).id

    // Get file to delete (for blob URL)
    const fileToDelete = await db.query.files.findFirst({
      where: (f, { eq, and }) => and(eq(f.id, id), eq(f.userId, userId)),
    })

    if (!fileToDelete) {
      throw new ApiError('File not found or access denied', HTTP_STATUS.NOT_FOUND)
    }

    // Delete from Vercel Blob
    await del(fileToDelete.url)

    // Delete file from database
    const result = await db
      .delete(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .returning()

    if (result.length === 0) {
      throw new ApiError('File not found', HTTP_STATUS.NOT_FOUND)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    // Handle errors and return error response
    return createErrorResponse('Failed to delete file', HTTP_STATUS.INTERNAL_SERVER_ERROR, err)
  }
}
