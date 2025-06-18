import { Button } from '@/components/ui/button'

import { Send, Square } from 'lucide-react'

interface ChatSendButtonProps {
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  input: string
  stop: () => void
  onSubmit: () => void
}

export const ChatSendButton = ({ status, input, stop, onSubmit }: ChatSendButtonProps) => {
  return (
    <>
      {status === 'streaming' ? (
        <Button
          variant="destructive"
          size="icon"
          disabled={status !== 'streaming'}
          onClick={() => stop()}
          className="h-8 w-8 rounded-full"
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={status !== 'ready' || !input.trim()}
          onClick={onSubmit}
          className="h-8 w-8 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}
