import { z } from 'zod'

export const UploadedFileSchema = z.object({
  id: z.string().length(12, 'Invalid file ID'),
  userId: z.string().max(255, 'Invalid user ID'),
  projectId: z.string().max(255, 'Invalid project ID').optional(),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(52, 'Title must be at most 52 characters'),
  description: z.string().max(512, 'Description must be at most 512 characters').optional(),
  url: z.string().url('Invalid URL'),
  parsedContent: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type UploadedFile = z.infer<typeof UploadedFileSchema>

export const FileUpdateSchema = UploadedFileSchema.pick({
  title: true,
  description: true,
  projectId: true,
  updatedAt: true,
})

export type FileUpdate = z.infer<typeof FileUpdateSchema>

export const FileUploadSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(52, 'Title must be at most 52 characters'),
  description: z.string().max(512, 'Description must be at most 512 characters').optional(),
  projectId: z.string().optional(),
  parsedContent: z.string().optional(),
})

export type FileUpload = z.infer<typeof FileUploadSchema>
