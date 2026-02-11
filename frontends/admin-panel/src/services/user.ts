import { userApi } from "@/services/api"

export interface User {
  id: string
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User | null
}

export const userService = {
  // 🔹 Login adaptado ao formato do backend atual
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await userApi.post("/users/login", payload)

    // o backend retorna: { status: 200, data: "<token>" }
    const token =
      typeof res.data === "string"
        ? res.data
        : typeof res.data?.data === "string"
        ? res.data.data
        : null

    if (!token) throw new Error("Token inválido recebido do servidor.")

    return {
      token,
      user: null, // por enquanto backend não retorna dados do usuário
    }
  },

  // 🔹 obter usuário logado (quando o backend implementar /users/me)
  me: async (): Promise<User> => {
    const res = await userApi.get<{ data: User }>("/users/me")
    return res.data
  },
}
