import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import type { UIMessage } from 'ai'
import { Plus } from 'lucide-react'

interface ChatNewButtonProps {
  setMessages: (messages: UIMessage[]) => void
}

export const ChatNewButton = ({ setMessages }: ChatNewButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="ml-auto" size="icon" variant="ghost" onClick={() => setMessages([])}>
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>New Chat</TooltipContent>
    </Tooltip>
  )
}
