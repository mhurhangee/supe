import { ApiError } from '@/lib/utils'

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    // Transform the error into a format that can be thrown
    throw new ApiError(data.error || ' An error occurred', res.status)
  }

  return data
}
