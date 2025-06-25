import { cn } from '@/lib/utils'

import type { UIMessage } from 'ai'
import { Bot, User } from 'lucide-react'

import { ChatThinking } from './chat-thinking'
import { Markdown } from './markdown'

interface MessageDisplayProps {
  message: UIMessage
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  lastMessage?: boolean
}

export const MessageDisplay = ({ message, status, lastMessage }: MessageDisplayProps) => {
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
          <Markdown>
            {message.parts
              ? message.parts
                  .filter(part => part.type === 'text')
                  .map(part => part.text)
                  .join('')
              : ''
            }
          </Markdown>
          {JSON.stringify(message)}
          {status === 'streaming' && message.role === 'assistant' && lastMessage && (
            <ChatThinking />
          )}
        </div>
      </div>
    </div>
  )
}
