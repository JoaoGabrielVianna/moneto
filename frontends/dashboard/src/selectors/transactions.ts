// src/selectors/transactions.ts
import type { Transaction } from "../models/transaction";
import type { DateRangeYMD } from "../utils/date";
import { ymdOf } from "../utils/date";

export type Tab = "all" | "income" | "expense";

export type TransactionFilters = {
  tab: Tab;
  searchTerm: string;
  categoryId: "all" | string;
  categoryNameById: Map<string, string>;
  dateRangeYMD?: DateRangeYMD | null; // NOVO
};

export function filterAndSortTransactions(
  transactions: Transaction[],
  { tab, searchTerm, categoryId, categoryNameById, dateRangeYMD }: TransactionFilters
): Transaction[] {
  const s = searchTerm.trim().toLowerCase();

  return transactions
    .filter((t) => (tab === "all" ? true : t.type === tab))
    .filter((t) => (categoryId === "all" ? true : t.categoryId === categoryId))
    .filter((t) => {
      if (!s) return true;
      const inDesc = (t.description ?? "").toLowerCase().includes(s);
      const inNotes = (t.notes ?? "").toLowerCase().includes(s);
      const inCat = (categoryNameById.get(t.categoryId) ?? "").toLowerCase().includes(s);
      return inDesc || inNotes || inCat;
    })
    .filter((t) => {
      if (!dateRangeYMD) return true;
      const ymd = ymdOf(t.date);
      return ymd >= dateRangeYMD.startYMD && ymd <= dateRangeYMD.endYMD;
    })
    .sort((a, b) => {
      const da = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
      const db = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
      return db - da; // mais recente primeiro
    });
}

export function totals(transactions: Transaction[]) {
  // Se seu amount já é number, isso é suficiente:
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
  return { income, expense, balance: income - expense };
}
