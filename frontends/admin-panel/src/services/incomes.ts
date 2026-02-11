import { incomeApi } from "./api"

export const IncomeService = {
  list: async () => incomeApi.get("/incomes"),
  create: async (payload: any) => incomeApi.post("/incomes", payload),
  update: async (id: string, payload: any) => incomeApi.put(`/incomes/${id}`, payload),
  remove: async (id: string) => incomeApi.delete(`/incomes/${id}`),
}
