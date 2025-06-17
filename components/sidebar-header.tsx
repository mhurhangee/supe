import Link from 'next/link'

import { Logo } from '@/components/ui/logo'
import { SidebarHeader as SidebarHeaderComponent } from '@/components/ui/sidebar'

import { appConfig } from '@/lib/config'

export function SidebarHeader() {
  return (
    <SidebarHeaderComponent>
      <Link href="/" className="flex items-center gap-2 py-2 text-xl font-semibold tracking-tight">
        <Logo iconSize="h-6 w-6" bgSize="h-8 w-8" />
        {appConfig.appName}
      </Link>
    </SidebarHeaderComponent>
  )
}
