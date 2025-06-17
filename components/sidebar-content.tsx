'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useAuth, useUser } from "@clerk/nextjs"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import {
  SidebarContent as SidebarContentComponent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { sidebarItems } from '@/lib/config'

export function SidebarContent() {
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useAuth()
  
  // Only render items that match the current authentication state
  const shouldShowGroup = (group: any) => {
    if (!isLoaded) return false // Don't show anything until auth is loaded
    if (group.loggedIn === null) return true // Show to everyone
    return group.loggedIn === isSignedIn // Show based on login status
  }
  
  const shouldShowItem = (item: any) => {
    if (!isLoaded) return false
    if (item.loggedIn === undefined || item.loggedIn === null) return true
    return item.loggedIn === isSignedIn
  }
  
  return (
    <SidebarContentComponent>
      {isLoaded && sidebarItems
        .filter(shouldShowGroup)
        .map((group) => (
          <Collapsible
            key={group.group}
            defaultOpen={group.defaultOpen}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center">
                  {group.group}
                  {group.collapsible && (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="p-1">
                    {group.items
                      .filter(shouldShowItem)
                      .map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.name}
                            isActive={pathname === item.href}
                          >
                            <Link href={item.href} className="flex items-center">
                              {item.icon}
                              <span className="ml-2">{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
    </SidebarContentComponent>
  )
}
