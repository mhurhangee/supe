'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  SidebarContent as SidebarContentComponent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { navItems } from '@/lib/config'

export function SidebarContent() {
  const pathname = usePathname()
  return (
    <SidebarContentComponent>
      <SidebarMenu className="p-1">
        {navItems.map(navItem => (
          <SidebarMenuItem key={navItem.href}>
            <SidebarMenuButton asChild tooltip={navItem.name} isActive={pathname === navItem.href}>
              <Link href={navItem.href} className="flex items-center">
                {navItem.icon}
                <span className="ml-2">{navItem.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContentComponent>
  )
}
