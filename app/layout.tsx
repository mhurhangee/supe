import { ClerkProvider } from '@clerk/nextjs'

import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

import { appConfig, fontMono, fontSans } from '@/lib/config'

import '@/styles/globals.css'

const title = `${appConfig.appName} | ${appConfig.appDescription}`

export const metadata: Metadata = {
  title: process.env.NODE_ENV === 'development' ? ` (dev) ${title}` : title,
  description: appConfig.appDescription,
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${appConfig.emojiFavicon}</text></svg>`,
      },
    ],
    shortcut: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${appConfig.emojiFavicon}</text></svg>`,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <TooltipProvider>
              {children}
              <Toaster position="top-center" />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
