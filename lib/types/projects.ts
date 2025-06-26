import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().length(12, 'Invalid project ID'),
  userId: z.string().max(255, 'Invalid user ID'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(52, 'Title must be at most 52 characters'),
  description: z.string().max(512, 'Description must be at most 512 characters').optional(),
  tags: z
    .array(
      z
        .string()
        .min(3, 'Tag must be at least 3 characters')
        .max(16, 'Tag must be at most 16 characters')
    )
    .max(3, 'Maximum 3 tags'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type Project = z.infer<typeof ProjectSchema>

export const ProjectUpdateSchema = ProjectSchema.pick({
  title: true,
  description: true,
  tags: true,
  updatedAt: true,
})

export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>
