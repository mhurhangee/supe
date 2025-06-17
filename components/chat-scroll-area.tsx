import { CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { UIMessage } from 'ai'
import { Bot } from 'lucide-react'

import { MessageDisplay } from './chat-messages-display'

export const ChatScrollArea = ({
  messages,
  messagesEndRef,
  status,
}: {
  messages: UIMessage[]
  messagesEndRef: React.RefObject<HTMLDivElement>
  status: 'submitted' | 'streaming' | 'ready' | 'error'
}) => {
  return (
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
              <MessageDisplay
                key={msg.id}
                message={msg}
                status={status}
                lastMessage={msg === messages[messages.length - 1]}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
    </ScrollArea>
  )
}
