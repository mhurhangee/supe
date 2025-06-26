import { models, systemPrompts } from '@/lib/ai'
import { textSearch } from '@/lib/ai-tools'

import { UIMessage, convertToModelMessages, smoothStream, streamText } from 'ai'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: models.mini,
    system: systemPrompts.patent,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'line',
    }),
    tools: {
      textSearch,
    },
    toolChoice: 'auto',
  })

  return result.toUIMessageStreamResponse()
}
