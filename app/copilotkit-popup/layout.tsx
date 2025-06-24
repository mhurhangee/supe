'use client'

import { CopilotKit } from '@copilotkit/react-core'
import '@copilotkit/react-ui/styles.css'

export default function CopilotKitLayout({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="generalAgent">
      {children}
    </CopilotKit>
  )
}
