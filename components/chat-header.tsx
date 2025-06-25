import { UIMessage } from 'ai'

import { ChatNewButton } from './chat-new-button'
import { CardHeader, CardTitle } from './ui/card'

interface ChatHeaderProps {
  setMessages: (messages: UIMessage[]) => void
  title: string
  icon: React.ReactNode
}

export const ChatHeader = ({ setMessages, title, icon }: ChatHeaderProps) => {
  return (
    <CardHeader className="bg-background shrink-0 p-4">
      <CardTitle className="flex items-center gap-2 text-xl font-medium">
        {icon}
        <span>{title}</span>
        <ChatNewButton setMessages={setMessages} />
      </CardTitle>
    </CardHeader>
  )
}
