import { categoryApi } from "@/services/api"
import type { Category, CategoryDraft } from "@/types/category"

export const categoryService = {
  list: async (): Promise<Category[]> => {
    const res = await categoryApi.get<{ data: Category[] }>("/category/list")

    // garante que sempre retorna um array
    return Array.isArray(res.data) ? res.data : []
  },

  create: async (payload: CategoryDraft): Promise<Category> => {
    const res = await categoryApi.post<{ data: Category }>("/category/create", payload)
    return res.data
  },

  update: async (
    id: string,
    payload: Partial<CategoryDraft>
  ): Promise<Category> => {
    const res = await categoryApi.put<{ data: Category }>(`/category/${id}`, payload)
    return res.data
  },

  remove: async (id: string): Promise<void> => {
    await categoryApi.delete(`/category/delete/${id}`)
  },
}
