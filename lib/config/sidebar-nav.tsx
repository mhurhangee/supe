import {
  Bot,
  Columns2,
  FileBadge,
  FileCode,
  HelpCircle,
  Home,
  Hourglass,
  LayoutGrid,
  LogIn,
  MessageCircleQuestion,
  ScanText,
} from 'lucide-react'

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
        href: '/beta-chat',
        icon: <Bot className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Pat Chat',
        href: '/pat-chat',
        icon: <FileBadge className="h-4 w-4" />,
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
        name: 'PDF Claim Extractor',
        href: '/pdf-claim-extractor',
        icon: <ScanText className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Parse PDF',
        href: '/parse-pdf',
        icon: <FileCode className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Misc',
    collapsible: true,
    defaultOpen: false,
    loggedIn: true,
    items: [
      {
        name: 'Split',
        href: '/split',
        icon: <Columns2 className="h-4 w-4" />,
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
