'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Layout } from '@/components/layout'
import { Markdown } from '@/components/markdown'

import { Loader2, RotateCcw, Umbrella } from 'lucide-react'

import { getWeatherInfo } from './action'

export default function Form() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await getWeatherInfo(formData)
    setResult(res)
    setLoading(false)
  }

  return (
    <Layout>
      <main className="superfier-container container">
        <h1 className="superfier-title">
          <Umbrella className="h-10 w-10" /> Weather
        </h1>
        <p className="superfier-subtitle">Enter a city to get the weather.</p>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input name="city" placeholder="Enter city" required />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Umbrella className="h-4 w-4" />
            )}
          </Button>
          <Button type="reset" variant="ghost" onClick={() => setResult(null)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </form>
        {result ? (
          <Markdown>{result}</Markdown>
        ) : loading ? (
          <p className="animate-pulse text-center">Loading...</p>
        ) : (
          <p className="text-center">No result yet.</p>
        )}
      </main>
    </Layout>
  )
}
