import { incomeApi, expenseApi } from "@/services/api"
import type { Transaction, TransactionDraft } from "@/types/transaction"

export const transactionService = {
  list: async (): Promise<Transaction[]> => {
    const [incomes, expenses] = await Promise.all([
      incomeApi.get<{ data: Transaction[] }>("/incomes/list"),
      expenseApi.get<{ data: Transaction[] }>("/expenses/list"),
    ])

    return [
      ...incomes.data.map((t) => ({ ...t, type: "income" as const })),
      ...expenses.data.map((t) => ({ ...t, type: "expense" as const })),
    ].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },

  create: async (payload: TransactionDraft): Promise<Transaction> => {
    const api = payload.type === "income" ? incomeApi : expenseApi
    console.log("PAYLOAD", payload)
    // 🔹 Normaliza os campos conforme o backend espera
    const body = {
      amount: String(payload.amount).replace(".", ","), // "1000" ou "1.000,50"
      category_id: payload.category_id,
      date: new Date(payload.date).toISOString(),
      description: payload.description,
      notes: payload.notes,
      user_id: payload.userId, // se existir
    }

    const res = await api.post<{ data: Transaction }>(
      `/${payload.type}s/create`,
      body
    )

    return { ...res.data, type: payload.type }
  },

  update: async (id: string, payload: Partial<TransactionDraft>): Promise<Transaction> => {
    const api = payload.type === "income" ? incomeApi : expenseApi

    const body = {
      ...(payload.amount && { amount: Number(payload.amount).toFixed(2) }),
      ...(payload.category_id && { category_id: payload.category_id }),
      ...(payload.date && { date: new Date(payload.date).toISOString() }),
      ...(payload.description && { description: payload.description }),
      ...(payload.notes && { notes: payload.notes }),
      ...(payload.userId && { user_id: payload.userId }),
    }

    const res = await api.put<{ data: Transaction }>(
      `/${payload.type}s/update/${id}`,
      body
    )

    return { ...res.data, type: payload.type as "income" | "expense" }
  },

  remove: async (id: string, type: "income" | "expense"): Promise<void> => {
    const api = type === "income" ? incomeApi : expenseApi
    await api.delete(`/${type}s/delete/${id}`)
  },
}
