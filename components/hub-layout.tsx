'use client'

import React, { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface HubPageProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  primaryAction?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  className?: string
  backTo?: {
    label: string
    href: string
  }
}

export function HubLayout({
  title,
  description,
  icon,
  actions,
  primaryAction,
  children,
  fullWidth = false,
  className = '',
}: HubPageProps) {
  const isMobile = useIsMobile()

  // Combine primary action with other actions if provided
  const combinedActions =
    primaryAction || actions ? (
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {primaryAction && <div className="ml-2">{primaryAction}</div>}
      </div>
    ) : null

  return (
    <>
      {/* Top Header with Sidebar Toggle and Breadcrumbs */}
      <div className="bg-background/50 border-muted-foreground/20 sticky top-0 z-50 mb-2 flex items-center justify-between gap-4 border-b px-4 pt-1 pb-2 shadow-sm backdrop-blur-xs transition-all">
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          {icon && icon}
          {title && title}
          {description && !isMobile && (
            <div className="text-muted-foreground text-xs">{description}</div>
          )}
        </div>
        {combinedActions}
      </div>
      <div
        className={cn(
          'superfier-container container mx-auto sm:px-6',
          fullWidth ? 'max-w-screen-xl' : 'max-w-5xl',
          className
        )}
      >
        {/* Main content */}
        <div className="w-full">{children}</div>
      </div>
    </>
  )
}
