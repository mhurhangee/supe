'use client'

import { useChat } from '@ai-sdk/react'

import { useEffect, useRef } from 'react'

import { Card, CardFooter } from '@/components/ui/card'

import { ChatHeader } from '@/components/chat-header'
import { ChatInput } from '@/components/chat-input'
import { ChatScrollArea } from '@/components/chat-scroll-area'
import { Layout } from '@/components/layout'

export default function BasicChat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages, status, stop } = useChat({
    api: '/api/basic-chat',
  })

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Layout>
      <main className="container mx-auto mt-12 flex h-[calc(100vh-4rem)] w-full max-w-4xl flex-col">
        <Card className="bg-background flex w-full flex-1 flex-col overflow-hidden border-none shadow-none">
          <ChatHeader setMessages={setMessages} />

          <ChatScrollArea messages={messages} messagesEndRef={messagesEndRef} status={status} />

          <CardFooter className="bg-background mt-auto shrink-0 p-4">
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSubmit(e)
              }}
              className="w-full"
            >
              <ChatInput
                value={input}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                placeholder="Type your message here..."
                disabled={status !== 'ready'}
                maxRows={5}
                status={status}
                stop={stop}
              />
            </form>
          </CardFooter>
        </Card>
      </main>
    </Layout>
  )
}
