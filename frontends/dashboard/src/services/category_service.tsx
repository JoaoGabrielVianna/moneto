import type { Category, CategoryUpdate } from "../models/category";
import { API_BASE_CATEGORY, request } from "./api";

interface ApiResponse<T> {
  status: number;
  data: T;
}

export const CategoryService = {
  async list(): Promise<Category[]> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Category[]>>(
      `${API_BASE_CATEGORY}/category/list`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data ?? [];
  },

  async create(
    data: Omit<Category, "id" | "created_at" | "updated_at">
  ): Promise<Category> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Category>>(
      `${API_BASE_CATEGORY}/category/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  async update(id: string, data: CategoryUpdate): Promise<Category> {
    const token = localStorage.getItem("token");
    const res = await request<ApiResponse<Category>>(
      `${API_BASE_CATEGORY}/category/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Envie apenas os campos presentes (ok com ponteiros no back)
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  async remove(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await request(`${API_BASE_CATEGORY}/category/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
