export type Category = {
  id: string
  userId?: string
  name: string
  type: "income" | "expense" | "both"
  description: string
  color: string
  created_at: string
  updatedAt: string
  usageCount?: number
}


export type CategoryDraft = Omit<
  Category,
  "id" | "createdAt" | "updatedAt" | "usageCount"
>