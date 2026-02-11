import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useCategories } from "@/hooks/use-categor"

const CategoryContext = createContext<ReturnType<typeof useCategories> | null>(null)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const manager = useCategories()
  const value = useMemo(() => manager, [manager])

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}

export function useCategoryContext() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error("useCategoryContext must be used within CategoryProvider")
  return ctx
}
