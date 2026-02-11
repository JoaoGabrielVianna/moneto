/**
 * Aceita apenas cores HEX válidas.
 * - Se vier "#xxxxxx" ou "#xxx", mantém.
 * - Se vier "bg-...", "text-..." ou nomes, ignora e retorna fallback.
 */
export function normalizeHexColor(input?: string): string {
  if (!input) return "#9CA3AF" // cinza neutro padrão (text-muted-foreground)

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (hexRegex.test(input.trim())) {
    return input.trim()
  }

  // ❌ Se não for hex, ignora e devolve fallback
  return "#9CA3AF"
}
