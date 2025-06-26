import { UIMessage } from 'ai'
import { parsePdfToMarkdown } from '@/lib/llama-index/api'
import { appendOcrResultToMessage, dataUrlToArrayBuffer, extractPdfDataUrl } from '@/lib/utils/file-utils'
import { getLlamaCloudApiKey } from '@/lib/utils/env-utils'
import { streamTextMessages } from '@/lib/ai'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json()

    try {
        // Check if there's a PDF file in the messages
        const { dataUrl, fileName } = extractPdfDataUrl(messages);

        // If there's a PDF, process it with LlamaIndex OCR
        if (dataUrl && fileName) {
            // Get the API key from environment variables
            const llamaCloudApiKey = getLlamaCloudApiKey();

            // Convert data URL to ArrayBuffer
            const fileBuffer = await dataUrlToArrayBuffer(dataUrl);

            // Process the PDF with LlamaIndex
            const markdownResult = await parsePdfToMarkdown(fileBuffer, fileName, llamaCloudApiKey);

            // Append the OCR result to the last message
            appendOcrResultToMessage(messages, markdownResult);
        }

        return streamTextMessages({ messages })

    } catch (error) {
        console.error('Error processing PDF with LlamaIndex:', error);

        // Continue with the original messages if there's an error
        return streamTextMessages({ messages })
    }
}
