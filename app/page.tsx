import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { appConfig } from "@/lib/config"

export default function Home() {
  return (
    <SidebarLayout
      breadcrumbSegments={[
        {
          name: "Welcome to " + appConfig.appName,
          href: "/",
        },
      ]} // Home page doesn't need breadcrumbs
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AI Chat</CardTitle>
            <CardDescription>Chat with our AI assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ask questions, get answers, and explore ideas with our AI chat assistant.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Models</CardTitle>
            <CardDescription>Explore available AI models</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Browse and use different AI models for various tasks and applications.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Code Assistant</CardTitle>
            <CardDescription>Get help with your code</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Generate code, debug issues, and get programming assistance.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Commands</CardTitle>
            <CardDescription>Execute AI commands</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Run predefined AI commands to automate tasks and workflows.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Customize the application settings to suit your needs.</p>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  )
}