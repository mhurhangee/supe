import { NextRequest, NextResponse } from 'next/server'

import { getLlamaCloudApiKey, parseFile } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const apiKey = getLlamaCloudApiKey()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const content = await parseFile(file, apiKey)

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Parsing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse document' },
      { status: 500 }
    )
  }
}
