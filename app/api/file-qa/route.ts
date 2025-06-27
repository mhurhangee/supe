import { models, systemPrompts } from '@/lib/ai'
import { web_search_preview } from '@/lib/ai-tools'
import { db } from '@/lib/db/drizzle'
import { files } from '@/lib/db/schema'
import { getUserId } from '@/lib/utils'

import { UIMessage, convertToModelMessages, smoothStream, streamText } from 'ai'
import { and, eq, inArray } from 'drizzle-orm'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  const userId = await getUserId()
  const {
    messages,
    toolWeb,
    fileIds,
  }: { messages: UIMessage[]; toolWeb: boolean; fileIds: string[] } = await req.json()

  const editedMessages = messages

  if (fileIds.length > 0) {
    const userFiles = await db
      .select({
        title: files.title,
        description: files.description,
        parsedContent: files.parsedContent,
      })
      .from(files)
      .where(and(eq(files.userId, userId), inArray(files.id, fileIds)))

    for (const file of userFiles) {
      editedMessages.push({
        id: `file-${file.title}-${Date.now()}`,
        role: 'user',
        parts: [
          {
            type: 'text',
            text: `The following was extracted from a file called: ${file.title}\n, which has the following description: ${file.description}\n\n## File Content: \n${file.parsedContent || 'No content extracted from this file.'}`,
          },
        ],
      })
    }
  }

  const result = streamText({
    model: models.mini,
    system: systemPrompts.basic,
    messages: convertToModelMessages(editedMessages),
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
