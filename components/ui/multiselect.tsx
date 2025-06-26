'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

import { X } from 'lucide-react'

interface MultiselectProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  max?: number
  maxLength?: number
  disabled?: boolean
  className?: string
}

export function Multiselect({
  value,
  onChange,
  placeholder = 'Add tag...',
  max = 3,
  maxLength = 16,
  disabled = false,
  className = '',
}: MultiselectProps) {
  const [input, setInput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleAdd(e?: React.KeyboardEvent | React.FocusEvent) {
    if (e) e.preventDefault()
    const tag = input.trim()
    if (!tag) return
    if (value.includes(tag)) {
      setError('Tag already added')
      return
    }
    if (tag.length > maxLength) {
      setError(`Tag max ${maxLength} chars`)
      return
    }
    if (value.length >= max) {
      setError(`Max ${max} tags allowed`)
      return
    }
    setError(null)
    onChange([...value, tag])
    setInput('')
    inputRef.current?.focus()
  }

  function handleRemove(tag: string) {
    onChange(value.filter(t => t !== tag))
    setError(null)
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-md border px-2 py-1',
        className,
        disabled && 'pointer-events-none opacity-60'
      )}
      tabIndex={-1}
      aria-disabled={disabled}
    >
      {value.map(tag => (
        <span key={tag} className="bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-xs">
          {tag}
          <button
            type="button"
            className="hover:text-destructive ml-1 p-0.5"
            aria-label={`Remove tag ${tag}`}
            onClick={() => handleRemove(tag)}
            tabIndex={0}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {value.length < max && (
        <div className="flex min-w-0 flex-1 items-center">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setError(null)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                handleAdd(e)
              } else if (e.key === 'Backspace' && input === '') {
                // Remove last tag
                if (value.length > 0) handleRemove(value[value.length - 1])
              }
            }}
            maxLength={maxLength}
            placeholder={placeholder}
            className="h-6 w-40 min-w-0 flex-1 border-0 bg-transparent px-1 py-0 text-xs shadow-none focus-visible:ring-0 focus-visible:outline-none"
            disabled={disabled}
            aria-label="Add tag"
            autoComplete="off"
          />
        </div>
      )}
      {error && <span className="text-destructive ml-2 text-xs">{error}</span>}
    </div>
  )
}
