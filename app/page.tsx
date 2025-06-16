import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Layout } from '@/components/layout'

import { appConfig } from '@/lib/config'

import { Github } from 'lucide-react'

export default function Home() {
  return (
    <Layout>
      <main className="superfier-container flex flex-col items-center justify-center">
        <h1 className="superfier-title">
          <appConfig.icon className="h-12 w-12" /> {appConfig.appName}
        </h1>
        <p className="superfier-subtitle text-center">{appConfig.appDescription}</p>
        <Button asChild className="animate-pulse">
          <Link href="/">Get Started</Link>
        </Button>
      </main>
      <footer className="superfier-footer">
        {' '}
        by {appConfig.author}{' '}
        <Link href={appConfig.github}>
          <Github className="ml-2 h-4 w-4" />
        </Link>
      </footer>
    </Layout>
  )
}
