import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useDashboard } from "@/hooks/use-dashboard"

const DashboardContext = createContext<ReturnType<typeof useDashboard> | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const manager = useDashboard()
  const value = useMemo(() => manager, [manager])
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboardContext must be used within DashboardProvider")
  return ctx
}
