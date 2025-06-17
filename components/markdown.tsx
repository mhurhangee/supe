import { cn } from '@/lib/utils'

import ReactMarkdown from 'react-markdown'

export const Markdown = ({ children, darkMode }: { children: string; darkMode?: boolean }) => {
  return (
    <div
      className={cn(darkMode ? 'prose-invert dark:prose-sm' : 'prose dark:prose-invert prose-sm')}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
