"use client"

import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface HeaderProps {
  breadcrumbSegments?: {
    name: string
    href: string
    isCurrent?: boolean
  }[]
  children?: React.ReactNode
  className?: string
}

export function Header({
  breadcrumbSegments = [],
  children,
  className,
}: HeaderProps) {
  return (
    <header className={cn("ontainer flex h-14 items-center px-4 sm:px-6", className)}>
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <SidebarTrigger />

          {/* Breadcrumbs */}
          
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
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
        <div className="flex flex-1 items-center justify-end gap-2">
          {children}
        </div>
    
    </header>
  )
}
