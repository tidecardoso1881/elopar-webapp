'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AuthHashHandler() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.slice(1))
    const error = params.get('error')
    const errorCode = params.get('error_code')

    if (error) {
      const code = errorCode ?? 'invalid_link'
      router.replace(`/update-password?auth_error=${code}`)
    }
  }, [router])

  return null
}
