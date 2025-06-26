'use client'

import React, { Fragment, ReactNode } from 'react'

import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import { ArrowLeftIcon } from 'lucide-react'

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
  breadcrumbs,
  actions,
  primaryAction,
  children,
  fullWidth = false,
  className = '',
  backTo,
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
      <div className="bg-background/50 border-muted-foreground/20 sticky top-0 z-50 mb-4 flex items-center justify-between gap-4 border-b px-4 py-3 shadow-sm backdrop-blur-xs transition-all">
        <div className="flex items-center gap-4 overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="size-6 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>Sidebar</TooltipContent>
          </Tooltip>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="overflow-hidden">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, i, arr) => {
                  const isLast = i === arr.length - 1
                  return isLast ? (
                    <BreadcrumbItem key={i}>
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <Fragment key={i}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href || '#'}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        {!isMobile && backTo && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground font-medium"
              asChild
            >
              <Link href={backTo.href}>
                <ArrowLeftIcon className="size-4" />
                {backTo.label}
              </Link>
            </Button>
        )}

        {/* Allow actions in the top bar for easier mobile access */}
        {isMobile && combinedActions}
      </div>
      <div
        className={cn(
          'superfier-container container mx-auto sm:px-6',
          fullWidth ? 'max-w-screen-xl' : 'max-w-5xl',
          className
        )}
      >
        {/* Header section */}
        {(title || description || (!isMobile && combinedActions)) && (
          <div className="mb-8">
            <div
              className={cn(
                'flex flex-wrap gap-4',
                isMobile ? 'flex-col' : 'flex-row items-center justify-between'
              )}
            >
              {title && (
                <div className="flex items-center gap-2">
                  {icon && <span className="text-primary mr-2">{icon}</span>}
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                </div>
              )}
              {!isMobile && combinedActions}
            </div>
            {description && <div className="text-muted-foreground mt-2 text-lg">{description}</div>}
          </div>
        )}

        {/* Main content */}
        <div className="w-full">{children}</div>
      </div>
    </>
  )
}
