'use client'

import { useChat } from '@ai-sdk/react'

import { useEffect, useRef, useState } from 'react'

import { ChatInput } from '@/components/chat-input'
import { ChatNewButton } from '@/components/chat-new-button'
import { ChatScrollArea } from '@/components/chat-scroll-area'
import { ChatTools } from '@/components/chat-tools'
import { HubLayout } from '@/components/hub-layout'

import { UploadedFile } from '@/lib/types/files'

import { DefaultChatTransport } from 'ai'
import { FileQuestion } from 'lucide-react'

export default function FileQAPage() {
  const [toolWeb, setToolWeb] = useState(false)
  const [input, setInput] = useState('')
  const [debug, setDebug] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])

  // Create a transport that includes toolWeb and fileIds
  const transport = new DefaultChatTransport({
    api: '/api/file-qa',
  })

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    transport,
    id: `file-qa-${selectedFiles.map(f => f.id).join('-')}`,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <HubLayout
      icon={<FileQuestion />}
      title="File QA"
      description="Chat with your files"
      actions={<ChatNewButton setMessages={setMessages} />}
    >
      <main className="container mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col">
        <ChatScrollArea
          messages={messages}
          messagesEndRef={messagesEndRef}
          status={status}
          debug={debug}
          welcomeMessage="Send a message to start chatting"
        />
        <form
          onSubmit={e => {
            e.preventDefault()
            sendMessage(
              { role: 'user', parts: [{ type: 'text', text: input }] },
              { body: { toolWeb, fileIds: selectedFiles.map(file => file.id) } }
            )
            setInput('')
          }}
          className="w-full"
        >
          <ChatInput
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={status !== 'ready'}
            maxRows={5}
            status={status}
            stop={stop}
            tools={
              <ChatTools
                toolWeb={toolWeb}
                setToolWeb={setToolWeb}
                debug={debug}
                setDebug={setDebug}
                selectedFiles={selectedFiles}
                onFilesChange={setSelectedFiles}
              />
            }
            selectedFiles={selectedFiles}
          />
        </form>
      </main>
    </HubLayout>
  )
}
