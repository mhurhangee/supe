import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import {
  Bath,
  Bot,
  HelpCircle,
  Home,
  Hourglass,
  LayoutGrid,
  LogIn,
  LucideProps,
  MessageCircleQuestion,
  PlaneTakeoff,
  Trees,
  Umbrella,
} from 'lucide-react'

export const appConfig = {
  appName: 'Superfier',
  appDescription: 'A playground for testing, and prototyping my AI ideas',
  emojiFavicon: '🌳',
  icon: (props: LucideProps) => <Trees {...props} />,
  iconBackground: 'bg-gradient-to-r from-green-500 to-emerald-500',
  author: 'm.hurhangee@me.com',
  github: 'https://github.com/mhurhangee/supe',
}

export interface SidebarItem {
  group: string
  collapsible: boolean
  defaultOpen: boolean
  loggedIn: boolean | null
  items: {
    name: string
    href: string
    icon: React.ReactNode
    loggedIn: boolean | null
  }[]
}

export const sidebarItems: SidebarItem[] = [
  {
    group: 'Navigation',
    collapsible: false,
    defaultOpen: true,
    loggedIn: null,
    items: [
      {
        name: 'Home',
        href: '/',
        icon: <Home className="h-4 w-4" />,
        loggedIn: false, // Show to everyone
      },
      {
        name: 'Sign In',
        href: '/sign-in',
        icon: <LogIn className="h-4 w-4" />,
        loggedIn: false,
      },
      {
        name: 'Waitlist',
        href: '/waitlist',
        icon: <Hourglass className="h-4 w-4" />,
        loggedIn: false,
      },
      {
        name: 'FAQ',
        href: '/faq',
        icon: <HelpCircle className="h-4 w-4" />,
        loggedIn: false,
      },
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutGrid className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Chat UI',
    collapsible: true,
    defaultOpen: true,
    loggedIn: true,
    items: [
      {
        name: 'AI SDK Chat',
        href: '/aisdk-chat',
        icon: <Bot className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Copilot Kit Popup',
        href: '/copilotkit-popup',
        icon: <PlaneTakeoff className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Image',
    collapsible: true,
    defaultOpen: true,
    loggedIn: true,
    items: [
      {
        name: 'Room Designer',
        href: '/room-designer',
        icon: <Bath className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Tools',
    collapsible: true,
    defaultOpen: true,
    loggedIn: true,
    items: [
      {
        name: 'Weather',
        href: '/weather',
        icon: <Umbrella className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Help',
    collapsible: true,
    defaultOpen: false,
    loggedIn: true, // Show to everyone
    items: [
      {
        name: 'FAQ',
        href: '/faq',
        icon: <MessageCircleQuestion className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
]

export const fontSans = Space_Grotesk({
  variable: '--font-google-sans',
  subsets: ['latin'],
})

export const fontMono = JetBrains_Mono({
  variable: '--font-google-mono',
  subsets: ['latin'],
})

export const FAQ = [
  {
    question: 'What is Superfier?',
    answer:
      "Superfier is an AI-playground for testing and prototyping. It's somewhere I can test and experiment with AI models, technologies, tools, and ideas.",
  },
  {
    question: 'Where can I find the source code?',
    answer:
      'The source code is available on GitHub at [https://github.com/mhurhangee/supe](https://github.com/mhurhangee/supe).',
  },
  {
    question: 'Who is behind Superfier?',
    answer: 'm.hurhangee@me.com is the creator of Superfier. ',
  },
  {
    question: 'Is Superfier free?',
    answer:
      'Yes, Superfier is free and is meant to be used for testing, prototyping, and learning.',
  },
  {
    question: 'Can I get access?',
    answer: 'If you want access, please join the waitlist and I will get back to you.',
  },
]
