import type { Income } from "../models/income";
import { API_BASE_INCOMES, request } from "./api";

interface ApiResponse<T> {
  status: number;
  data: T;
}

export const IncomeService = {
  async list(): Promise<Income[]> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Income[]>>(`${API_BASE_INCOMES}/incomes/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data ?? [];
  },

  async create(data: Omit<Income, "Id" | "CreatedAt" | "UpdatedAt">): Promise<Income> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Income>>(`${API_BASE_INCOMES}/incomes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.data;
  },

  async update(id: string, data: Partial<Income>): Promise<Income> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Income>>(`${API_BASE_INCOMES}/incomes/update/${id}`, {
      method: "PUT",
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
    await request(`${API_BASE_INCOMES}/incomes/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
