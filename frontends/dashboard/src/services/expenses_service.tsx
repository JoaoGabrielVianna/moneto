import type { Expense } from "../models/expense";
import { API_BASE_EXPENSES, request } from "./api";

interface ApiResponse<T> {
  status: number;
  data: T;
}

export const ExpenseService = {
  async list(): Promise<Expense[]> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Expense[]>>(`${API_BASE_EXPENSES}/expenses/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data ?? [];
  },

  async create(data: Omit<Expense, "Id" | "CreatedAt" | "UpdatedAt">): Promise<Expense> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Expense>>(`${API_BASE_EXPENSES}/expenses/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.data;
  },

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Expense>>(`${API_BASE_EXPENSES}/expenses/update/${id}`, {
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
    await request(`${API_BASE_EXPENSES}/expenses/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
