import { IncomeService } from "./incomes_service";
import { ExpenseService } from "./expenses_service";
import type { Transaction } from "../models/transaction";
import { toDateSafe } from "../utils/date";

export const TransactionService = {
  async list(): Promise<Transaction[]> {
    const [incomes, expenses] = await Promise.all([
      IncomeService.list(),
      ExpenseService.list(),
    ]);

    const mappedIncomes: Transaction[] = incomes.map((i) => ({
      id: i.id,
      userId: i.user_id,
      categoryId: i.category_id,
      amount: String(i.amount),                   // garante string
      description: i.description ?? "",
      date: toDateSafe(i.date),                   // → Date
      notes: i.notes ?? "",
      createdAt: toDateSafe(i.created_at),
      updatedAt: toDateSafe(i.updated_at),
      type: "income",
    }));

    const mappedExpenses: Transaction[] = expenses.map((e) => ({
      id: e.id,
      userId: e.user_id,
      categoryId: e.category_id,
      amount: String(e.amount),
      description: e.description ?? "",
      date: toDateSafe(e.date),
      notes: e.notes ?? "",
      createdAt: toDateSafe(e.created_at),
      updatedAt: toDateSafe(e.updated_at),
      type: "expense",
    }));

    return [...mappedIncomes, ...mappedExpenses].sort(
      (a, b) => b.date.getTime() - a.date.getTime()   // ordena por data da transação desc
    );
  },
};
