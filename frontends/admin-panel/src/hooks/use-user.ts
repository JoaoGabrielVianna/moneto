import { useCallback, useEffect, useState } from "react"
import { userService, type User, type LoginPayload } from "@/services/user"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // tenta restaurar sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) fetchUser()
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const data = await userService.me()
      setUser(data)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    setError(null)
    try {
      setLoading(true)
      const { token, user } = await userService.login(payload)
      localStorage.setItem("token", token)
      setUser(user || { id: "", name: "Usuário", email: payload.email }) // fallback temporário
      return user || { id: "", name: "Usuário", email: payload.email }
    } catch (err: any) {
      setError(err.message || "Falha ao realizar login")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])


  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setUser(null)
  }, [])

  return { user, loading, error, login, logout, fetchUser }
}
