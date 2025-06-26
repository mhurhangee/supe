import { parsePdfToMarkdown } from '@/lib/llama-index/api'
import { getLlamaCloudApiKey } from '@/lib/utils/env-utils'

export const maxDuration = 300
export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (file.type !== 'application/pdf') {
      return new Response(JSON.stringify({ error: 'File must be a PDF' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the API key from environment variables
    const llamaCloudApiKey = getLlamaCloudApiKey();
    
    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Process the PDF with LlamaIndex
    const markdownResult = await parsePdfToMarkdown(fileBuffer, file.name, llamaCloudApiKey);
    
    return new Response(JSON.stringify({ markdown: markdownResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing PDF with LlamaIndex:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse PDF';
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}