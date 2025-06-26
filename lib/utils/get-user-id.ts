'use server'

import { auth } from '@clerk/nextjs/server'

// Get user ID or throw error
export async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}
