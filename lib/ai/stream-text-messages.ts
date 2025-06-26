import { type UIMessage, convertToModelMessages, smoothStream, streamText } from 'ai'

import { models } from './models'

export async function streamTextMessages({ messages }: { messages: UIMessage[] }) {
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
