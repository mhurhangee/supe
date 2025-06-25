import { Bug, Globe } from 'lucide-react'

import { Toggle } from './ui/toggle'

export const ChatTools = ({
  toolWeb,
  setToolWeb,
  debug,
  setDebug,
}: {
  toolWeb: boolean
  setToolWeb: (value: boolean) => void
  debug: boolean
  setDebug: (value: boolean) => void
}) => {
  return (
    <div>
      <Toggle pressed={toolWeb} onPressedChange={setToolWeb} className="z-100 rounded-full">
        <Globe className="h-4 w-4" />
      </Toggle>
      <Toggle pressed={debug} onPressedChange={setDebug} className="z-100 rounded-full">
        <Bug className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
