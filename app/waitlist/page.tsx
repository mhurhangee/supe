import { Waitlist } from '@clerk/nextjs'

import { Layout } from '@/components/layout'

import { Hourglass } from 'lucide-react'

export default function WaitlistPage() {
  return (
    <Layout>
      <main className="superfier-container container">
        <h1 className="superfier-title">
          <Hourglass className="h-10 w-10" /> Waitlist
        </h1>
        <p className="superfier-subtitle">
          Join the waitlist to be notified when Superfier is available.
        </p>
        <section className="flex items-center justify-center">
          <Waitlist />
        </section>
      </main>
    </Layout>
  )
}
