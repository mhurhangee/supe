import { models } from '@/lib/ai'

import { UIMessage, convertToModelMessages, smoothStream, streamText } from 'ai'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: models.mini,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'line',
    }),
  })

  return result.toUIMessageStreamResponse()
}
