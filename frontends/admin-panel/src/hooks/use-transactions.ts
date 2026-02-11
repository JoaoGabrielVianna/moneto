import { useCallback, useEffect, useRef, useState } from "react"
import { transactionService } from "@/services/transactions"
import type { Transaction, TransactionDraft } from "@/types/transaction"

const TTL_MS = 5 * 60_000 // 5 minutos

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
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
      const data = await transactionService.list()
      setTransactions(data)
      lastLoadedRef.current = Date.now()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Erro ao carregar transações")
    } finally {
      setLoading(false)
      refreshingRef.current = false
    }
  }, [])

  useEffect(() => {
    refresh(true)
  }, [refresh])

  const create = useCallback(async (payload: TransactionDraft) => {
    const newTx = await transactionService.create(payload)
    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }, [])

  const update = useCallback(
    async (id: string, payload: Partial<TransactionDraft>) => {
      const updated = await transactionService.update(id, payload)
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)))
      return updated
    },
    []
  )

  const remove = useCallback(async (id: string, type: "income" | "expense") => {
    await transactionService.remove(id, type)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clear = useCallback(() => {
    setTransactions([])
    setError(null)
    setLoading(false)
    lastLoadedRef.current = null
  }, [])

  return {
    transactions,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    clear,
  }
}
