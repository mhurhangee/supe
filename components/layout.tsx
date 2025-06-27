'use client'

import React from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'

import { LayoutContent } from '@/components/layout-content'
import { Sidebar } from '@/components/sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar />
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}
