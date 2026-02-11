import { useCallback, useEffect, useRef, useState } from "react"
import { dashboardService, type DashboardSummary, type DashboardHistory } from "@/services/dashboard"

const TTL_MS = 5 * 60_000 // 5 minutos

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary[]>([])
  const [history, setHistory] = useState<DashboardHistory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lastLoadedRef = useRef<number | null>(null)
  const hasLoadedRef = useRef(false) // 👈 novo: impede refresh duplo

  const refresh = useCallback(async (force = false) => {
    if (loading || (hasLoadedRef.current && !force)) return
    setLoading(true)
    setError(null)
    try {
      const [summaryData, historyData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getHistory("1y"),
      ])
      setSummary(summaryData)
      setHistory(historyData)
      hasLoadedRef.current = true
      lastLoadedRef.current = Date.now()
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Erro ao carregar dashboard")
    } finally {
      setLoading(false)
    }
  }, [loading])

  // ✅ só executa no primeiro mount
  useEffect(() => {
    if (!hasLoadedRef.current) refresh(true)
  }, [refresh])

  // 🔹 agora refreshHistory NÃO mexe com summary nem loading global
  const refreshHistory = useCallback(async (period: string) => {
    try {
      const data = await dashboardService.getHistory(period)
      setHistory(data)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Erro ao atualizar histórico")
    }
  }, [])

  return {
    summary,
    history,
    loading,
    error,
    refresh,
    refreshHistory,
  }
}
