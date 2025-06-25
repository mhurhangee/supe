'use client'

import { useChat } from '@ai-sdk/react'

import { useEffect, useRef, useState } from 'react'

import { Card, CardFooter } from '@/components/ui/card'

import { ChatHeader } from '@/components/chat-header'
import { ChatInput } from '@/components/chat-input'
import { ChatScrollArea } from '@/components/chat-scroll-area'
import { Layout } from '@/components/layout'
import { DefaultChatTransport } from 'ai';

export default function BasicChat() {
  const [toolWeb, setToolWeb] = useState(false)
  const [input, setInput] = useState('')

  // Create a transport that updates when toolWeb changes
  const transport = new DefaultChatTransport({
    api: '/api/aisdk-chat',
    body: {
      toolWeb,
    },
  })

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    transport,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Layout>
      <main className="container mx-auto mt-12 flex h-[calc(100vh-4rem)] w-full max-w-4xl flex-col">
        <Card className="bg-background border-card flex w-full flex-1 flex-col overflow-hidden border-none shadow-none">
          <ChatHeader setMessages={setMessages} />

          <ChatScrollArea messages={messages} messagesEndRef={messagesEndRef} status={status} />

          <CardFooter className="bg-background mt-auto shrink-0 p-4">
            <form
              onSubmit={e => {
                e.preventDefault()
                sendMessage({ text: input });
                setInput('');
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
                toolWeb={toolWeb}
                setToolWeb={setToolWeb}
              />
            </form>
          </CardFooter>
        </Card>
      </main>
    </Layout>
  )
}
