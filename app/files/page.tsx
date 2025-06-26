'use client'

import { FileIcon } from 'lucide-react'

export default function FilesPage() {
  return (
    <main className="superfier-container container">
      <h1 className="superfier-title">
        <FileIcon className="h-10 w-10" />
        Files
      </h1>
      <p className="superfier-subtitle">Manage your files here.</p>
    </main>
  )
}
