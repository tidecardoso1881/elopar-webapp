'use client'

import { useState } from 'react'
import { AuditLogDiff } from '@/components/AuditLogDiff'

interface DiffButtonProps {
  entidadeId: string
  dadosAntes: Record<string, unknown> | null
  dadosDepois: Record<string, unknown> | null
}

export function DiffButton({ entidadeId, dadosAntes, dadosDepois }: DiffButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue-600 hover:underline whitespace-nowrap"
      >
        Ver Diff
      </button>
      {open && (
        <AuditLogDiff
          entidadeId={entidadeId}
          dadosAntes={dadosAntes}
          dadosDepois={dadosDepois}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
