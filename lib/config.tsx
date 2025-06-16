import { TreeDeciduous, LucideProps } from 'lucide-react'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'

export const appConfig = {
  appName: 'superfier',
  appDescription: 'Elevate your business with AI',
  emojiFavicon: '🌳',
  icon: (props: LucideProps) => <TreeDeciduous {...props} />,
  author: 'm.hurhangee@me.com',
  github: 'https://github.com/mhurhangee/supe',
}

export const fontSans = Space_Grotesk({
  variable: '--font-google-sans',
  subsets: ['latin'],
})

export const fontMono = JetBrains_Mono({
  variable: '--font-google-mono',
  subsets: ['latin'],
})