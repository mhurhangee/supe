import { models, systemPrompts } from '@/lib/ai'

import { smoothStream, streamText } from 'ai'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: models.mini,
    system: systemPrompts.basic,
    messages,
    experimental_transform: smoothStream(),
  })

  return result.toDataStreamResponse()
}
