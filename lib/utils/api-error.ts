import { NextResponse } from 'next/server'

export interface ApiResponse<T> {
  data: T
  success: true
}

export interface ApiErrorResponse {
  error: string
  success: false
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.status = status
  }
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
}

// Standard error response creator
export function createErrorResponse(message: string, status: number, err?: unknown) {
  const errorResponse: ApiErrorResponse = {
    error: message,
    success: false,
  }
  console.error(`❌ STATUS: ${status} MESSAGE: ${message} ERROR: ${err}`)
  return NextResponse.json(errorResponse, { status })
}

// Standard API error response handling
export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || 'Something went wrong', response.status)
  }

  return data as T
}
