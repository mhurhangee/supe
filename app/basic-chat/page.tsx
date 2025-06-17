'use client'

import { useChat } from '@ai-sdk/react'

import { useEffect, useRef } from 'react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import { ChatNewButton } from '@/components/chat-new-button'
import { ChatSendButton } from '@/components/chat-send-button'
import { Layout } from '@/components/layout'
import { Markdown } from '@/components/markdown'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import type { UIMessage } from 'ai'
import { Bot, User } from 'lucide-react'

const MessageBubble = ({ message }: { message: UIMessage }) => {
  const isUser = message.role === 'user'
  return (
    <div className={cn('mb-4 flex w-full last:mb-0', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'flex max-w-[80%] items-start gap-2',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full p-2',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div
          className={cn(
            'rounded-lg px-4 py-2 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted rounded-tl-none'
          )}
        >
          <Markdown darkMode={isUser}>{message.content}</Markdown>
        </div>
      </div>
    </div>
  )
}

export default function BasicChat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages, status, stop } = useChat({
    api: '/api/basic-chat',
  })
  const isMobile = useIsMobile()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Layout>
      <main className="container mx-auto mt-12 flex h-[calc(100vh-4rem)] w-full max-w-4xl flex-col">
        <Card className="bg-background flex w-full flex-1 flex-col overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-background shrink-0 p-4">
            <CardTitle className="flex items-center gap-2 text-xl font-medium">
              <Bot className="h-5 w-5" />
              <span>Basic Chat</span>
              <ChatNewButton isMobile={isMobile} setMessages={setMessages} />
            </CardTitle>
          </CardHeader>

          <ScrollArea className="flex-1 overflow-hidden">
            <CardContent className="flex min-h-0 flex-col overflow-y-auto p-4 pt-4 pb-0">
              {messages.length === 0 ? (
                <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
                  <Bot className="mb-2 h-8 w-8 opacity-50" />
                  <p>Send a message to start chatting</p>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>
          </ScrollArea>

          <CardFooter className="bg-background mt-auto shrink-0 p-4">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                name="prompt"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                disabled={status !== 'ready'}
                className="flex-1"
                autoComplete="off"
              />
              <ChatSendButton isMobile={isMobile} status={status} input={input} stop={stop} />
            </form>
          </CardFooter>
        </Card>
      </main>
    </Layout>
  )
}
