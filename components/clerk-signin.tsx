import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

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