import { Button } from '@/components/ui/button'

import { Send, Square } from 'lucide-react'

interface ChatSendButtonProps {
  isMobile: boolean
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  input: string
  stop: () => void
}

export const ChatSendButton = ({ isMobile, status, input, stop }: ChatSendButtonProps) => {
  return (
    <>
      {status === 'streaming' ? (
        <Button
          variant="destructive"
          size={isMobile ? 'icon' : 'default'}
          disabled={status !== 'streaming'}
          onClick={stop}
        >
          {isMobile ? (
            <Square className="h-4 w-4" />
          ) : (
            <>
              <Square className="mr-2 h-4 w-4" />
              Stop
            </>
          )}
        </Button>
      ) : (
        <Button
          type="submit"
          size={isMobile ? 'icon' : 'default'}
          disabled={status !== 'ready' || !input.trim()}
        >
          {isMobile ? (
            <Send className="h-4 w-4" />
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>
      )}
    </>
  )
}
