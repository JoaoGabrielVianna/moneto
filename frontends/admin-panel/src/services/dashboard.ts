import { dashboardApi } from "@/services/api"

export interface DashboardHistory {
  labels: string[]
  income: number[]
  expense: number[]
  balance: number[]
}

export const dashboardService = {
  async getSummary() {
    const res = await dashboardApi.get<{ data: { total_income: number; total_expense: number; balance: number } }>(
      "/dashboard/summary"
    )

    const d = res.data
    return [
      {
        totalIncome: d.total_income,
        totalExpense: d.total_expense,
        balance: d.balance,
      },
    ]
  },

  async getHistory(period = "1y"): Promise<DashboardHistory> {
    const res = await dashboardApi.get<{ data: DashboardHistory }>(
      `/dashboard/history?period=${period}`
    )
    return res.data
  },
}
