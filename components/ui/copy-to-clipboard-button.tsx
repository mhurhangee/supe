'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'

interface CopyToClipboardButtonProps {
  content: string
}

export function CopyToClipboardButton({ content }: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false)
  const [, copy] = useCopyToClipboard() //TODO: fix this
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        copy(content)
        setCopied(true)
        toast.success('Copied to clipboard', {
          description: 'Content has been copied to clipboard',
        })
        setTimeout(() => setCopied(false), 2000)
      }}
      className="flex items-center gap-2"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
