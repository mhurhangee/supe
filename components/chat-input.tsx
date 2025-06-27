import React, { KeyboardEvent, useRef } from 'react'

import { Textarea } from '@/components/ui/textarea'

import type { UploadedFile } from '@/lib/types/files'
import { cn } from '@/lib/utils'

import { ChatSendButton } from './chat-send-button'
import { FileChips } from './file-selector'

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  maxRows?: number
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  stop: () => void
  tools?: React.ReactNode
  selectedFiles?: UploadedFile[]
}

export function ChatInput({
  value,
  onChange,
  placeholder = 'Type your message here...',
  disabled = false,
  status,
  stop,
  tools,
  selectedFiles = [],
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea height as user types
  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  // Handle keyboard events for sending and newlines
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // Enter alone submits the form
      e.preventDefault()
      if (value.trim() && !disabled) {
        // Find the closest form and submit it
        const form = e.currentTarget.closest('form')
        if (form) {
          form.requestSubmit()
        }

        // Reset textarea height after submit
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    }
    // Otherwise, allow default (newlines with Shift/Ctrl/Meta)
  }

  return (
    <div className="border-input relative flex w-full flex-col overflow-hidden rounded-lg border shadow-sm">
      {/* Main container with no internal borders */}
      <div className="flex w-full flex-col">
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-2">
            <FileChips selectedFiles={selectedFiles} onRemove={() => {}} readOnly />
          </div>
        )}
        {/* Textarea area */}
        <div className="relative w-full">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onInput={handleInput}
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
          {tools}
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="text-muted-foreground text-xs">
              {value.length > 0 ? `${value.length} characters` : ''}
            </span>
            <ChatSendButton status={status} input={value} stop={stop} />
          </div>
        </div>
      </div>
    </div>
  )
}
