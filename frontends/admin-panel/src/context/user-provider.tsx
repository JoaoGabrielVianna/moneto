import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useUser } from "@/hooks/use-user"

const UserContext = createContext<ReturnType<typeof useUser> | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const userManager = useUser()
  const value = useMemo(() => userManager, [userManager])
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUserContext must be used within UserProvider")
  return ctx
}
