import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useTransactions } from "@/hooks/use-transactions"

const TransactionContext = createContext<ReturnType<typeof useTransactions> | null>(null)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const manager = useTransactions()
  const value = useMemo(() => manager, [manager])

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

export function useTransactionContext() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error("useTransactionContext must be used within a TransactionProvider")
  return ctx
}
