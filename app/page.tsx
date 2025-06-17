import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Layout } from '@/components/layout'

import { appConfig } from '@/lib/config'

import { Logo } from '@/components/ui/logo'

import { Github, Hourglass, LogIn, LayoutGrid } from 'lucide-react'

import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function Home() {
  return (
    <Layout>
      <main className="superfier-container flex flex-col items-center justify-center">
        <h1 className="superfier-title">
          <Logo iconSize="h-10 w-10" bgSize="h-12 w-12" /> {appConfig.appName}
        </h1>
        <p className="superfier-subtitle text-center ">{appConfig.appDescription}</p>
        <div className="flex items-center justify-center gap-2">
          <SignedOut>
            <Button asChild>
              <Link href="/sign-in"><LogIn className="h-4 w-4" /> Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/waitlist"><Hourglass className="h-4 w-4" /> Waitlist</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link href="/dashboard"><LayoutGrid className="h-4 w-4" /> Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
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
