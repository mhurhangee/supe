import { SignIn } from '@clerk/nextjs'

import { LogIn } from 'lucide-react'

export default function SignInPage() {
  return (
    <main className="superfier-container container">
      <h1 className="superfier-title">
        <LogIn className="h-10 w-10" /> Sign In
      </h1>
      <p className="superfier-subtitle">Sign in to access your account.</p>
      <section className="flex items-center justify-center">
        <SignIn />
      </section>
    </main>
  )
}
