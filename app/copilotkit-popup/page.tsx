'use client'

import { CatchAllActionRenderProps, useCopilotAction } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Layout } from '@/components/layout'

import { PlaneTakeoff } from 'lucide-react'

export default function CopilotKitPage() {
  return (
    <main>
      <YourMainContent />
      <CopilotSidebar
        clickOutsideToClose={true}
        defaultOpen={true}
        labels={{
          title: 'Copilot Kit sidebar',
          initial: '👋 Hi, there!',
        }}
      />
    </main>
  )
}

function YourMainContent() {
  //🪁 Generative UI: https://docs.copilotkit.ai/coagents/generative-ui
  useCopilotAction({
    name: '*',
    render: (props: CatchAllActionRenderProps) => {
      const InfoBox = ({ title, content }: { title: string; content: unknown }) => (
        <div className="bg-muted rounded-xl p-3">
          <h2 className="text-muted-foreground mb-1 text-sm">{title}</h2>
          <pre className="text-muted-foreground max-h-32 overflow-auto font-mono text-sm">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      )

      return (
        <details className="my-2 rounded-xl p-4">
          <summary className="text-muted-foreground cursor-pointer">
            {props.name} {props.status === 'complete' ? 'called!' : 'executing...'}
          </summary>
          <div className="space-y-2 py-4">
            <div className="grid grid-cols-2 gap-2">
              <InfoBox title="Name" content={props.name} />
              <InfoBox title="Status" content={props.status} />
            </div>
            <InfoBox title="Input" content={props.args} />
            <InfoBox title="Output" content={props.result} />
            <InfoBox title="Full Details" content={props} />
          </div>
        </details>
      )
    },
  })

  return (
    <Layout>
      <main className="superfier-container container">
        <h1 className="superfier-title">
          <PlaneTakeoff className="h-10 w-10" /> Copilot Kit
        </h1>
        <p className="superfier-subtitle">
          This is a demonstrative page,click the copilot icon to open the sidebar
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </main>
    </Layout>
  )
}
