'use client'

import React, { useState } from 'react'

export default function ScrapeForm() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setResult(data.html || JSON.stringify(data))
    } catch {
      setResult('Error fetching page.')
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="rounded border p-2"
        />
        <button type="submit" className="rounded bg-blue-500 p-2 text-white" disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>
      {result && <p>{result}</p>}
    </div>
  )
}
