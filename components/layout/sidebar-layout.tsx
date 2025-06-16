"use client"

import React from "react"
import Link from "next/link"
import {
  Home,
  Settings
} from "lucide-react"

import { Header } from "@/components/layout/header"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { appConfig } from "@/lib/config"

interface SidebarLayoutProps {
  children: React.ReactNode
  breadcrumbSegments?: {
    name: string
    href: string
  }[]
}

const tools = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
]

export function SidebarLayout({
  children,
  breadcrumbSegments = [],
}: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight py-2">
              <appConfig.icon className="h-6 w-6" />
              {appConfig.appName}
            </Link>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={tool.name}
                  >
                    <Link href={tool.href} className="flex items-center">
                      {tool.icon}
                      <span className="ml-2">{tool.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings" className="flex items-center">
                <Settings className="h-4 w-4" />
                <span className="ml-2">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            breadcrumbSegments={breadcrumbSegments.map((segment, index) => ({
              ...segment,
              isCurrent: index === breadcrumbSegments.length - 1
            }))}
          />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
