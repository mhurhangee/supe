'use client'

import { useChat } from '@ai-sdk/react'

import { useRef, useState } from 'react'

import { Card } from '@/components/ui/card'
import { CardFooter } from '@/components/ui/card'

import { ChatHeader } from '@/components/chat-header'
import { ChatInput } from '@/components/chat-input'
import { ChatScrollArea } from '@/components/chat-scroll-area'
import { Layout } from '@/components/layout'

import { DefaultChatTransport } from 'ai'
import { FileBadge } from 'lucide-react'

export default function PatChatPage() {
  const debug = true // Show debug info
  const [input, setInput] = useState('') // User input

  const transport = new DefaultChatTransport({
    api: '/api/pat-chat',
  })

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    transport,
    maxSteps: 5,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  return (
      <main className="container mx-auto mt-12 flex h-[calc(100vh-4rem)] w-full max-w-4xl flex-col">
        <Card className="bg-background border-card flex w-full flex-1 flex-col overflow-hidden border-none shadow-none">
          <ChatHeader
            setMessages={setMessages}
            title="Pat Chat"
            icon={<FileBadge className="h-5 w-5" />}
          />

          <ChatScrollArea
            messages={messages}
            messagesEndRef={messagesEndRef}
            status={status}
            debug={debug}
            welcomeMessage="Ask a question about patents..."
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
                placeholder="Ask a question about patents..."
                disabled={status !== 'ready'}
                maxRows={5}
                status={status}
                stop={stop}
              />
            </form>
          </CardFooter>
        </Card>
      </main>
    )
}
