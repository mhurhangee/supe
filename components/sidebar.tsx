'use client'

import { Sidebar as SidebarComponent } from '@/components/ui/sidebar'

import { SidebarContent } from '@/components/sidebar-content'
import { SidebarFooter } from '@/components/sidebar-footer'
import { SidebarHeader } from '@/components/sidebar-header'

export function Sidebar() {
  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </SidebarComponent>
  )
}
