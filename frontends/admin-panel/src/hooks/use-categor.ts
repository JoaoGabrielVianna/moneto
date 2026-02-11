import { useCallback, useEffect, useRef, useState } from "react"
import { categoryService } from "@/services/category"
import type { Category, CategoryDraft } from "@/types/category"

const TTL_MS = 10 * 60_000

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastLoadedRef = useRef<number | null>(null)
  const refreshingRef = useRef(false)

  const refresh = useCallback(async (force = false) => {
    if (refreshingRef.current) return
    if (!force && lastLoadedRef.current && Date.now() - lastLoadedRef.current < TTL_MS) return

    setLoading(true)
    refreshingRef.current = true
    setError(null)

    try {
      const data = await categoryService.list()
      setCategories(data)
      lastLoadedRef.current = Date.now()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Erro ao carregar categorias")
    } finally {
      setLoading(false)
      refreshingRef.current = false
    }
  }, [])

  useEffect(() => {
    refresh(true)
  }, [refresh])

  const create = useCallback(async (payload: CategoryDraft) => {
    const newCat = await categoryService.create(payload)
    setCategories((prev) => [newCat, ...prev])
    return newCat
  }, [])

  const update = useCallback(
    async (id: string, payload: Partial<CategoryDraft>) => {
      const updated = await categoryService.update(id, payload)
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
      return updated
    },
    []
  )

  const remove = useCallback(async (id: string) => {
    await categoryService.remove(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clear = useCallback(() => {
    setCategories([])
    setError(null)
    setLoading(false)
    lastLoadedRef.current = null
  }, [])

  return {
    categories,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    clear,
  }
}
