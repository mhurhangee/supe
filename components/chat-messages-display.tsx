import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { cn } from '@/lib/utils'

import type { UIMessage } from 'ai'
import { Bot, User } from 'lucide-react'

import { ChatThinking } from './chat-thinking'
import { Markdown } from './markdown'

interface MessageDisplayProps {
  message: UIMessage
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  lastMessage?: boolean
  debug?: boolean
}

export const MessageDisplay = ({ message, status, lastMessage, debug }: MessageDisplayProps) => {
  const isUser = message.role === 'user'
  return (
    <div className="mb-4 flex w-full justify-start last:mb-0">
      <div className="flex items-start gap-1">
        <div className="flex items-center justify-center rounded-full p-1">
          {isUser ? (
            <User className="text-muted-foreground mt-2 h-4 w-4" />
          ) : (
            <Bot className="mt-2 h-4 w-4" />
          )}
        </div>
        <div className={cn('rounded-lg px-4 py-2 text-sm', isUser && 'text-muted-foreground')}>
          {message.parts
            && message.parts.map(part => {
              switch (part.type) {
                case 'tool-textSearch':
                  return 'Asking for confirmation...'
                default:
                  return ''
              }
            })}
          <Markdown>
            {message.parts
              && message.parts
                .filter(part => part.type === 'text')
                .map(part => part.text)
                .join('')}
          </Markdown>
          {debug && (
            <Accordion type="single">
              <AccordionItem value="debug">
                <AccordionTrigger>Debug</AccordionTrigger>
                <AccordionContent>
                  <div className="bg-muted mt-2 w-[700px] rounded-xl p-3">
                    <h2 className="text-muted-foreground mb-1 text-sm">Message Debug</h2>
                    <pre className="text-muted-foreground max-h-48 overflow-auto font-mono text-xs">
                      {JSON.stringify(message, null, 2)}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {status === 'streaming' && message.role === 'assistant' && lastMessage && (
            <ChatThinking />
          )}
        </div>
      </div>
    </div>
  )
}
