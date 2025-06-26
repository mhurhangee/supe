import { UIMessage } from 'ai'

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/")
}

export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf"
}

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const validateFile = (file: File, acceptedTypes?: string[], maxSize?: number): string | null => {
  if (acceptedTypes && acceptedTypes.length > 0) {
    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type.match(type.replace("*", ".*"))
    })
    if (!isAccepted) {
      return `File type not accepted. Accepted types: ${acceptedTypes.join(", ")}`
    }
  }

  if (maxSize && file.size > maxSize) {
    return `File size too large. Maximum size: ${formatFileSize(maxSize)}`
  }

  return null
}

/**
 * Helper function to extract PDF data URL from messages
 * @param messages Array of UI messages
 * @returns Object containing dataUrl and fileName, or null if no PDF is found
 */
export function extractPdfDataUrl(messages: UIMessage[]): { dataUrl: string | null, fileName: string | null } {
  // Look for the last message with a PDF file
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    for (const part of message.parts) {
      if (part.type === 'file' && part.mediaType === 'application/pdf' && part.url) {
        return { 
          dataUrl: part.url,
          fileName: part.filename || 'document.pdf'
        };
      }
    }
  }
  return { dataUrl: null, fileName: null };
}

/**
 * Helper function to convert data URL to ArrayBuffer
 * @param dataUrl Data URL string
 * @returns ArrayBuffer containing the binary data
 */
export async function dataUrlToArrayBuffer(dataUrl: string): Promise<ArrayBuffer> {
  // Remove the data URL prefix and decode base64
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

/**
 * Appends OCR result text to a message
 * @param messages Array of UI messages
 * @param markdownResult OCR result in markdown format
 * @returns The modified messages array
 */
export function appendOcrResultToMessage(messages: UIMessage[], markdownResult: string): UIMessage[] {
  const lastMessageIndex = messages.length - 1;
  if (lastMessageIndex < 0) return messages;
  
  const lastMessage = messages[lastMessageIndex];
  
  // Find the text part or create a new one
  let textPartIndex = lastMessage.parts.findIndex(part => part.type === 'text');
  
  if (textPartIndex >= 0) {
    // Append to existing text part
    const textPart = lastMessage.parts[textPartIndex] as { type: 'text', text: string };
    // Create a new part with the same type and updated text
    lastMessage.parts[textPartIndex] = {
      type: 'text',
      text: `${textPart.text}\n\nOCR Result from PDF:\n\n${markdownResult}`
    };
  } else {
    // Add a new text part
    lastMessage.parts.push({
      type: 'text',
      text: `OCR Result from PDF:\n\n${markdownResult}`
    });
  }
  
  return messages;
}
  