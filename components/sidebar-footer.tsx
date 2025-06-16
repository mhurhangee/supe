import Link from 'next/link'

import {
  SidebarFooter as SidebarFooterComponent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { HelpCircle } from 'lucide-react'

export function SidebarFooter() {
  return (
    <SidebarFooterComponent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Settings">
            <Link href="/faq" className="flex items-center">
              <HelpCircle className="h-4 w-4" />
              <span className="ml-2">FAQ</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooterComponent>
  )
}
