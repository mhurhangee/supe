import { UIMessage } from 'ai'
import { Bot } from 'lucide-react'

import { ChatNewButton } from './chat-new-button'
import { CardHeader, CardTitle } from './ui/card'

interface ChatHeaderProps {
  setMessages: (messages: UIMessage[]) => void
}

export const ChatHeader = ({ setMessages }: ChatHeaderProps) => {
  return (
    <CardHeader className="bg-background shrink-0 p-4">
      <CardTitle className="flex items-center gap-2 text-xl font-medium">
        <Bot className="h-5 w-5" />
        <span>Chat</span>
        <ChatNewButton setMessages={setMessages} />
      </CardTitle>
    </CardHeader>
  )
}
