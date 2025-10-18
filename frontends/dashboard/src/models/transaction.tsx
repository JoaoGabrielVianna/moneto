export type Transaction = {
    id: string;
    userId: string;
    categoryId: string;
    amount: string;
    description: string;
    date: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    type: "income" | "expense";
  };
  