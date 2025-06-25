import { NextRequest, NextResponse } from 'next/server'

import { chromium } from 'playwright'

export const POST = async (req: NextRequest) => {
  const { url } = await req.json()

  if (!url) return NextResponse.json({ error: 'No URL provided' })

  // Launch browser
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Get content
  const content = await page.content()

  await browser.close()
  return NextResponse.json({ html: content })
}
