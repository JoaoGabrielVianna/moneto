export type Category = {
  id: string;
  name: string;
  type: string;          // "income" | "expense" | "both"
  description: string;
  color: string;
  created_at: string;    // backend manda time.Time -> string ISO
  updated_at: string;
};
export type CategoryUpdate = Partial<Pick<Category, "name" | "type" | "description" | "color">>;