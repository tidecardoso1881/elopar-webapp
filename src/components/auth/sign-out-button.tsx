'use client'

import { useTransition } from 'react'
import { signOut } from '@/app/(auth)/login/actions'

interface SignOutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className={className}
    >
      {isPending ? 'Saindo...' : (children ?? 'Sair')}
    </button>
  )
}