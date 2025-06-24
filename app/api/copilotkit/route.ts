import { MastraAgent } from '@ag-ui/mastra'
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime'

import { NextRequest } from 'next/server'

import { mastra } from '@/mastra'

// 2. You can use any service adapter here for multi-agent support.
const serviceAdapter = new ExperimentalEmptyAdapter()

// 3. Create the CopilotRuntime instance and utilize the Mastra AG-UI
// integration to get the remote agents.
const runtime = new CopilotRuntime({
  agents: {
    generalAgent: MastraAgent.getLocalAgent({
      mastra,
      agentId: 'generalAgent',
    }),
  },
})

// 4. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  })

  return handleRequest(req)
}
