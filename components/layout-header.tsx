'use client'

import React from 'react'

import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { cn } from '@/lib/utils'

interface LayoutHeaderProps {
  breadcrumbSegments?: {
    name: string
    href: string
    isCurrent?: boolean
  }[]
  children?: React.ReactNode
  className?: string
}

export function LayoutHeader({ breadcrumbSegments = [], children, className }: LayoutHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 container mx-auto flex h-14 items-center rounded-t-lg backdrop-blur',
        className
      )}
    >
      <div className="ml-2 flex flex-1 items-center gap-2 md:gap-2">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbSegments.map((segment, index) => (
              <React.Fragment key={segment.href}>
                <BreadcrumbItem>
                  {segment.isCurrent ? (
                    <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href}>{segment.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbSegments.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side content (passed as children) */}
      <div className="mt-2 mr-2 flex flex-1 items-center justify-end gap-2">{children}</div>
    </header>
  )
}
