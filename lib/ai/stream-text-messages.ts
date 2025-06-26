import { models } from "./models"
import { streamText, smoothStream, convertToModelMessages, type UIMessage } from "ai"

export async function streamTextMessages({
    messages,
}: {
    messages: UIMessage[]
}) {
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