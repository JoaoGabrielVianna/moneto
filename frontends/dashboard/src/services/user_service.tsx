// src/services/user_service.tsx
import type { User, UserUpdatePayload } from "../models/user";
import { API_BASE_USERS, request } from "./api";

interface ApiResponse<T> {
  status: number;
  data: T;
}

export const UserService = {
  async me(): Promise<User> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<User>>(`${API_BASE_USERS}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async findById(id: string): Promise<User> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<User>>(`${API_BASE_USERS}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  async update(id: string, data: UserUpdatePayload): Promise<User> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<User>>(`${API_BASE_USERS}/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // opcionais: se quiser manter padrão completo
  async list(): Promise<User[]> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<User[]>>(`${API_BASE_USERS}/users/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data ?? [];
  },

  async create(data: Omit<User, "id" | "created_at" | "updated_at"> & { password: string }): Promise<User> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<User>>(`${API_BASE_USERS}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async remove(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await request(`${API_BASE_USERS}/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
