import {
  SidebarFooter as SidebarFooterComponent,
} from '@/components/ui/sidebar'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function SidebarFooter() {
  return (
    <SidebarFooterComponent>
      <div className="flex items-center justify-center gap-4">
        <ThemeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>

      </div>
    </SidebarFooterComponent>
  )
}
