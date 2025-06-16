import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import { Home, LucideProps, MessageCircleQuestion, Trees } from 'lucide-react'

export const appConfig = {
  appName: 'superfier',
  appDescription: 'An AI-playground for testing and prototyping',
  emojiFavicon: '🌳',
  icon: (props: LucideProps) => <Trees {...props} />,
  author: 'm.hurhangee@me.com',
  github: 'https://github.com/mhurhangee/supe',
}

export const sidebarItems = [
  {
    group: 'Main',
    collapsible: false,
    defaultOpen: true,
    items: [
      {
        name: 'Home',
        href: '/',
        icon: <Home className="h-4 w-4" />,
      }
    ],
  },
  {
    group: 'AI Tools',
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        name: 'AI Chat',
        href: '/ai-chat',
        icon: <MessageCircleQuestion className="h-4 w-4" />,
      },
      {
        name: 'AI Models',
        href: '/ai-models',
        icon: <Trees className="h-4 w-4" />,
      },
    ],
  },
  {
    group: 'Help',
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        name: 'FAQ',
        href: '/faq',
        icon: <MessageCircleQuestion className="h-4 w-4" />,
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
]
