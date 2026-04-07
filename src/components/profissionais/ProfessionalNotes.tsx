'use client'

import { useState, useTransition } from 'react'
import { createNoteAction, updateNoteAction, deleteNoteAction } from '@/actions/professional-notes'

interface NoteAuthor {
  full_name: string | null
}

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
  author_id: string
  author: NoteAuthor | null
}

interface ProfessionalNotesProps {
  professionalId: string
  initialNotes: Note[]
  currentUserId: string
  currentRole: string
}

function formatRelativeTime(iso: string): string {
  const now = new Date()
  const date = new Date(iso)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`
  if (diffHour < 24) return `há ${diffHour} hora${diffHour !== 1 ? 's' : ''}`
  if (diffDay === 1) return 'ontem'
  if (diffDay < 7) return `há ${diffDay} dias`
  return new Date(iso).toLocaleDateString('pt-BR')
}

function initials(name: string | null): string {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const MAX_CHARS = 1000

export function ProfessionalNotes({
  professionalId,
  initialNotes,
  currentUserId,
  currentRole,
}: ProfessionalNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isAdmin = currentRole === 'admin'
  const canWrite = isAdmin || currentRole === 'gerente'

  function canEditNote(note: Note) {
    return isAdmin || note.author_id === currentUserId
  }

  function handleCreate() {
    if (!newContent.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await createNoteAction(professionalId, newContent)
      if (result.success) {
        setNewContent('')
        // Optimistic: will be refreshed by revalidatePath on next navigation
        // Show a placeholder note optimistically
        const placeholder: Note = {
          id: crypto.randomUUID(),
          content: newContent.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: currentUserId,
          author: { full_name: 'Você' },
        }
        setNotes(prev => [placeholder, ...prev])
      } else {
        setError(result.error ?? 'Erro ao criar nota')
      }
    })
  }

  function startEdit(note: Note) {
    setEditingId(note.id)
    setEditContent(note.content)
    setError(null)
  }

  function handleUpdate(noteId: string) {
    setError(null)
    startTransition(async () => {
      const result = await updateNoteAction(noteId, professionalId, editContent)
      if (result.success) {
        setNotes(prev => prev.map(n =>
          n.id === noteId
            ? { ...n, content: editContent.trim(), updated_at: new Date().toISOString() }
            : n
        ))
        setEditingId(null)
      } else {
        setError(result.error ?? 'Erro ao atualizar nota')
      }
    })
  }

  function handleDelete(noteId: string) {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    setError(null)
    startTransition(async () => {
      const result = await deleteNoteAction(noteId, professionalId)
      if (result.success) {
        setNotes(prev => prev.filter(n => n.id !== noteId))
      } else {
        setError(result.error ?? 'Erro ao excluir nota')
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Form de criação */}
      {canWrite && (
        <div className="space-y-2">
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Adicionar uma nota interna sobre este profissional..."
            maxLength={MAX_CHARS}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${newContent.length > MAX_CHARS * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}>
              {newContent.length}/{MAX_CHARS}
            </span>
            <button
              onClick={handleCreate}
              disabled={!newContent.trim() || newContent.length > MAX_CHARS || isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? 'Salvando...' : 'Adicionar Nota'}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
      )}

      {/* Lista de notas */}
      {notes.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          {canWrite ? 'Nenhuma nota ainda. Adicione a primeira nota acima.' : 'Nenhuma nota interna registrada.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map(note => {
            const isEditing = editingId === note.id
            const wasEdited = note.updated_at !== note.created_at &&
              new Date(note.updated_at).getTime() - new Date(note.created_at).getTime() > 1000
            const authorName = note.author?.full_name ?? '(usuário)'
            const initial = initials(note.author?.full_name ?? null)

            return (
              <li key={note.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                {/* Header da nota */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-indigo-700">{initial}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{authorName}</p>
                      <p className="text-xs text-gray-400">
                        {formatRelativeTime(note.created_at)}
                        {wasEdited && (
                          <span className="ml-1.5 italic text-gray-400">(editada)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  {canEditNote(note) && !isEditing && (
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        disabled={isPending}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40"
                        title="Editar nota"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={isPending}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Excluir nota"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                {/* Conteúdo / Editor inline */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      maxLength={MAX_CHARS}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${editContent.length > MAX_CHARS * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {editContent.length}/{MAX_CHARS}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleUpdate(note.id)}
                          disabled={!editContent.trim() || editContent.length > MAX_CHARS || isPending}
                          className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-40"
                        >
                          {isPending ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
