import { models, systemPrompts, tools } from '@/lib/ai'

import { smoothStream, streamText } from 'ai'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, toolWeb } = await req.json()

  const result = streamText({
    model: models.mini,
    system: systemPrompts.basic,
    messages,
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'line',
    }),
    tools: tools,
    toolChoice: toolWeb ? { type: 'tool', toolName: 'web_search_preview' } : 'auto',
  })

  return result.toDataStreamResponse()
}
