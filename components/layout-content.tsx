'use client'

import { SidebarInset } from '@/components/ui/sidebar'

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  return <SidebarInset>{children}</SidebarInset>
}
