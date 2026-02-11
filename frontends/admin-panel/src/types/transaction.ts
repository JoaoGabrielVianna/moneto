export type Transaction = {
  id: string
  userId: string
  category_id: string
  description: string
  amount: string
  date: string
  notes?: string
  type: "income" | "expense"
  created_at: string
  updated_at: string
}

export type TransactionDraft = Omit<Transaction, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}
