'use client'

import { Layout } from '@/components/layout'

import { LayoutGrid } from 'lucide-react'

export default function Dashboard() {
  return (
    <Layout>
      <main className="superfier-container container">
        <h1 className="superfier-title">
          <LayoutGrid className="h-10 w-10" /> Dashboard
        </h1>
        <p className="superfier-subtitle">Welcome to your dashboard.</p>
      </main>
    </Layout>
  )
}
