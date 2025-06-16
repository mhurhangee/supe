import Link from 'next/link'

import { SidebarHeader as SidebarHeaderComponent } from '@/components/ui/sidebar'

import { appConfig } from '@/lib/config'

export function SidebarHeader() {
  return (
    <SidebarHeaderComponent>
      <Link href="/" className="flex items-center gap-2 py-2 text-xl font-semibold tracking-tight">
        <appConfig.icon className="h-6 w-6" />
        {appConfig.appName}
      </Link>
    </SidebarHeaderComponent>
  )
}
