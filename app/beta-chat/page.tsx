'use client'

import { useChat } from '@ai-sdk/react'

import { useEffect, useRef, useState } from 'react'

import { Card, CardFooter } from '@/components/ui/card'

import { ChatHeader } from '@/components/chat-header'
import { ChatInput } from '@/components/chat-input'
import { ChatScrollArea } from '@/components/chat-scroll-area'
import { ChatTools } from '@/components/chat-tools'

import type { UploadedFile } from '@/lib/types/files'

import { DefaultChatTransport } from 'ai'
import { Bot } from 'lucide-react'

export default function BasicChat() {
  const [toolWeb, setToolWeb] = useState(false)
  const [input, setInput] = useState('')
  const [debug, setDebug] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])

  // Create a transport that updates when toolWeb or selectedFiles change
  const transport = new DefaultChatTransport({
    api: '/api/beta-chat',
    body: {
      toolWeb,
      fileIds: selectedFiles.map(file => file.id),
    },
  })

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    transport,
    id: `beta-chat-${selectedFiles.map(f => f.id).join('-')}`,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <main className="container mx-auto mt-12 flex h-[calc(100vh-4rem)] w-full max-w-4xl flex-col">
      <Card className="bg-background border-card flex w-full flex-1 flex-col overflow-hidden border-none shadow-none">
        <ChatHeader
          setMessages={setMessages}
          title="AI SDK v5 Chat"
          icon={<Bot className="h-5 w-5" />}
        />

        <ChatScrollArea
          messages={messages}
          messagesEndRef={messagesEndRef}
          status={status}
          debug={debug}
          welcomeMessage="Send a message to start chatting"
        />

        <CardFooter className="bg-background mt-auto shrink-0 p-4">
          <form
            onSubmit={e => {
              e.preventDefault()
              sendMessage({ text: input })
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
        </CardFooter>
      </Card>
    </main>
  )
}
