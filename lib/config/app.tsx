import { LucideProps, Trees } from 'lucide-react'

export const appConfig = {
  appName: 'Superfier',
  appDescription: 'A playground for testing, and prototyping my AI ideas',
  emojiFavicon: '🌳',
  icon: (props: LucideProps) => <Trees {...props} />,
  iconBackground: 'bg-gradient-to-r from-green-500 to-emerald-500',
  author: 'm.hurhangee@me.com',
  github: 'https://github.com/mhurhangee/supe',
}
