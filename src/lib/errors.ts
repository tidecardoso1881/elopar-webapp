/**
 * Centraliza tratamento de erros dos Server Actions.
 * Loga detalhes no servidor, retorna mensagem genérica para o cliente.
 */
export function handleActionError(error: unknown): string {
  if (error instanceof Error) {
    console.error('[action error]', error.message)
  } else {
    console.error('[action error]', error)
  }
  return 'Ocorreu um erro. Tente novamente.'
}
