import { expenseApi } from "./api"

export const ExpenseService = {
  list: async () => expenseApi.get("/expenses"),
  create: async (payload: any) => expenseApi.post("/expenses", payload),
  update: async (id: string, payload: any) => expenseApi.put(`/expenses/${id}`, payload),
  remove: async (id: string) => expenseApi.delete(`/expenses/${id}`),
}
