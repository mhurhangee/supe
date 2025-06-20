'use client'

import React from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { LayoutContent } from '@/components/layout-content'
import { Sidebar } from '@/components/sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar />
      <div className="absolute top-4 right-4 z-50">
        <SidebarTrigger />
      </div>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}
