import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

export const ClerkSignIn = () => {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Get Started</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
