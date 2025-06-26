import { ApiError, HTTP_STATUS } from '@/lib/utils'

import { ZodSchema } from 'zod'

export function parseIO<T>(
  schema: ZodSchema<T>,
  data: unknown,
  errorMessage = 'Invalid request body'
) {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    throw new ApiError(errorMessage, HTTP_STATUS.BAD_REQUEST)
  }
  return parsed.data
}
