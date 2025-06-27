import { toast } from 'sonner'
import { ZodSchema } from 'zod'

export function parseClientIO<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const msg = result.error.errors[0]?.message || 'Invalid input'
    toast.error(msg)
    return { success: false, error: msg, data: undefined }
  }
  return { success: true, error: null, data: result.data }
}
