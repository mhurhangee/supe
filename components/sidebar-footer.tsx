import { SignedIn, UserButton } from '@clerk/nextjs'

import { SidebarFooter as SidebarFooterComponent } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function SidebarFooter() {
  return (
    <SidebarFooterComponent>
      <div className="flex items-center justify-center gap-4 group-data-[collapsible=icon]:flex-col">
        <ThemeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </SidebarFooterComponent>
  )
}
