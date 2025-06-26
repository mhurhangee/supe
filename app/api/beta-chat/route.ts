import { models, systemPrompts } from '@/lib/ai'
import { web_search_preview } from '@/lib/ai-tools'

import { UIMessage, convertToModelMessages, smoothStream, streamText } from 'ai'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, toolWeb }: { messages: UIMessage[]; toolWeb: boolean } = await req.json()

  const result = streamText({
    model: models.mini,
    system: systemPrompts.basic,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'line',
    }),
    tools: {
      web_search_preview,
    },
    toolChoice: toolWeb ? { type: 'tool', toolName: 'web_search_preview' } : 'auto',
  })

  return result.toUIMessageStreamResponse()
}
