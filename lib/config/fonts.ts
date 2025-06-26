import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'

export const fontSans = Space_Grotesk({
  variable: '--font-google-sans',
  subsets: ['latin'],
})

export const fontMono = JetBrains_Mono({
  variable: '--font-google-mono',
  subsets: ['latin'],
})
