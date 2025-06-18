import React, { KeyboardEvent, useEffect, useRef } from 'react'

import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { Globe } from 'lucide-react'

import { ChatSendButton } from './chat-send-button'
import { Toggle } from './ui/toggle'

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
  maxRows?: number
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  stop: () => void
  toolWeb: boolean
  setToolWeb: (value: boolean) => void
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type your message here...',
  disabled = false,
  maxRows = 5,
  status,
  stop,
  toolWeb,
  setToolWeb,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'

    // Calculate the number of rows based on scrollHeight
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop) || 8
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom) || 8

    const currentRows = Math.floor(
      (textarea.scrollHeight - paddingTop - paddingBottom) / lineHeight
    )
    const rowsToUse = Math.min(currentRows, maxRows)

    // Set the height based on the number of rows
    textarea.style.height = `${rowsToUse * lineHeight + paddingTop + paddingBottom}px`
  }, [value, maxRows])

  // Auto-focus the textarea on component mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent default Enter behavior (form submission)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      // Only submit if there's content and not disabled
      if (value.trim() && !disabled) {
        onSubmit()
      }
    }
  }

  return (
    <div className="border-input relative flex w-full flex-col overflow-hidden rounded-lg border shadow-sm">
      {/* Main container with no internal borders */}
      <div className="flex w-full flex-col">
        {/* Textarea area */}
        <div className="relative w-full">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'max-h-[200px] min-h-[60px] resize-none overflow-y-auto px-3 py-3',
              'scrollbar scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-w-2',
              'border-0 focus-visible:border-0 focus-visible:ring-0', // Remove border and focus ring
              disabled && 'cursor-not-allowed opacity-50'
            )}
            rows={1}
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2">
          <Toggle pressed={toolWeb} onPressedChange={setToolWeb} className="rounded-full">
            <Globe className="h-4 w-4" />
          </Toggle>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="text-muted-foreground text-xs">
              {value.length > 0 ? `${value.length} characters` : ''}
            </span>
            <ChatSendButton status={status} input={value} stop={stop} onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}
