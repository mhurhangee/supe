import { Button } from '@/components/ui/button'

import type { UIMessage } from 'ai'
import { Plus } from 'lucide-react'

interface ChatNewButtonProps {
  isMobile: boolean
  setMessages: (messages: UIMessage[]) => void
}

export const ChatNewButton = ({ isMobile, setMessages }: ChatNewButtonProps) => {
  return (
    <Button className="ml-auto" variant="ghost" onClick={() => setMessages([])}>
      {isMobile ? (
        <Plus className="h-4 w-4" />
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </>
      )}
    </Button>
  )
}
