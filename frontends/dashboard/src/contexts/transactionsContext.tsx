import React, {
    createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  } from "react";
  import type { Transaction } from "../models/transaction";
  import { TransactionService } from "../services/transaction_service";
  import { IncomeService } from "../services/incomes_service";
  import { ExpenseService } from "../services/expenses_service";
  
  type SaveDraft = Omit<Transaction, "createdAt" | "updatedAt"> & { id?: string };
  
  type TxStorage = Omit<Transaction, "date" | "createdAt" | "updatedAt"> & {
    date: string; createdAt: string; updatedAt: string;
  };
  
  type TransactionsContextValue = {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    lastLoadedAt: number | null;
    refresh: (force?: boolean) => Promise<void>;
    save: (draft: SaveDraft) => Promise<Transaction>;
    remove: (t: Transaction) => Promise<void>;
    clear: () => void; // útil em logout
  };
  
  const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);
  
  const LS_KEY = "moneto.transactions.v1";
  const TTL_MS = 5 * 60_000; // 5min
  
  function toStorage(items: Transaction[]): TxStorage[] {
    return items.map((t) => ({
      ...t,
      date: (t.date instanceof Date ? t.date : new Date(t.date)).toISOString(),
      createdAt: (t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt)).toISOString(),
      updatedAt: (t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt)).toISOString(),
    }));
  }
  
  function fromStorage(items: TxStorage[]): Transaction[] {
    return items.map((t) => ({
      ...t,
      date: new Date(t.date),
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
  }
  
  export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as { items: TxStorage[]; ts: number };
        if (!parsed?.items) return [];
        if (Date.now() - parsed.ts > TTL_MS) return [];
        return fromStorage(parsed.items);
      } catch { return []; }
    });
  
    const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(() => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { ts: number };
        if (!parsed?.ts || Date.now() - parsed.ts > TTL_MS) return null;
        return parsed.ts;
      } catch { return null; }
    });
  
    const [loading, setLoading] = useState<boolean>(transactions.length === 0);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const refreshingRef = useRef(false);
  
    const persist = (items: Transaction[]) => {
      setTransactions(items);
      const ts = Date.now();
      setLastLoadedAt(ts);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ items: toStorage(items), ts }));
      } catch {}
    };
  
    const refresh = useCallback(async (force = false) => {
      if (refreshingRef.current) return;
      if (!force && lastLoadedAt && Date.now() - lastLoadedAt < TTL_MS) return;
  
      refreshingRef.current = true;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
  
      setLoading(true);
      setError(null);
      try {
        const data = await TransactionService.list(); // faz as 2 chamadas só aqui
        if (!ac.signal.aborted) persist(data);
      } catch (e: any) {
        if (!ac.signal.aborted) setError(e?.message || "Erro ao listar transações");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
        refreshingRef.current = false;
      }
    }, [lastLoadedAt]);
  
    useEffect(() => {
      if (transactions.length === 0) {
        refresh();
      } else if (!lastLoadedAt || Date.now() - lastLoadedAt > TTL_MS) {
        // stale-while-revalidate
        refresh(true);
      }
      return () => abortRef.current?.abort();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    // reage a login/logout (token mudou)
    useEffect(() => {
      const onStorage = (e: StorageEvent) => { if (e.key === "token") { clear(); refresh(true); } };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, [refresh]);
  
    const remove = useCallback(async (t: Transaction) => {
      const prev = transactions;
      const next = prev.filter((x) => x.id !== t.id);
      setTransactions(next); // otimista
      try {
        if (t.type === "income") await IncomeService.remove(t.id);
        else await ExpenseService.remove(t.id);
        persist(next);
      } catch (e) {
        setTransactions(prev); // rollback
        throw e;
      }
    }, [transactions]);
  
    const save = useCallback(async (draft: SaveDraft) => {
      const exists = draft.id && transactions.some((x) => x.id === draft.id);
      const toISO = (d: Date | string) => (d instanceof Date ? d.toISOString() : new Date(d).toISOString());
  
      let saved: Transaction;
      if (draft.type === "income") {
        if (exists && draft.id) {
          const res = await IncomeService.update(draft.id, {
            description: draft.description,
            amount: draft.amount,
            date: draft.date,
            category_id: draft.categoryId,
            notes: draft.notes,
          });
          saved = {
            id: res.id, userId: res.user_id, categoryId: res.category_id,
            amount: String(res.amount), description: res.description ?? "",
            date: new Date(res.date), notes: res.notes ?? "",
            createdAt: new Date(res.created_at), updatedAt: new Date(res.updated_at),
            type: "income",
          };
          persist(transactions.map((x) => (x.id === saved.id ? saved : x)));
          return saved;
        } else {
          const res = await IncomeService.create({
            user_id: draft.userId,
            category_id: draft.categoryId,
            amount: draft.amount,
            description: draft.description,
            date: toISO(draft.date),
            notes: draft.notes,
          } as any);
          saved = {
            id: res.id, userId: res.user_id, categoryId: res.category_id,
            amount: String(res.amount), description: res.description ?? "",
            date: new Date(res.date), notes: res.notes ?? "",
            createdAt: new Date(res.created_at), updatedAt: new Date(res.updated_at),
            type: "income",
          };
          persist([saved, ...transactions]);
          return saved;
        }
      } else {
        if (exists && draft.id) {
          const res = await ExpenseService.update(draft.id, {
            description: draft.description,
            amount: draft.amount,
            date: draft.date,
            category_id: draft.categoryId,
            notes: draft.notes,
          });
          saved = {
            id: res.id, userId: res.user_id, categoryId: res.category_id,
            amount: String(res.amount), description: res.description ?? "",
            date: new Date(res.date), notes: res.notes ?? "",
            createdAt: new Date(res.created_at), updatedAt: new Date(res.updated_at),
            type: "expense",
          };
          persist(transactions.map((x) => (x.id === saved.id ? saved : x)));
          return saved;
        } else {
          const res = await ExpenseService.create({
            user_id: draft.userId,
            category_id: draft.categoryId,
            amount: draft.amount,
            description: draft.description,
            date: toISO(draft.date),
            notes: draft.notes,
          } as any);
          saved = {
            id: res.id, userId: res.user_id, categoryId: res.category_id,
            amount: String(res.amount), description: res.description ?? "",
            date: new Date(res.date), notes: res.notes ?? "",
            createdAt: new Date(res.created_at), updatedAt: new Date(res.updated_at),
            type: "expense",
          };
          persist([saved, ...transactions]);
          return saved;
        }
      }
    }, [transactions]);
  
    const clear = useCallback(() => {
      setTransactions([]);
      setError(null);
      setLastLoadedAt(null);
      setLoading(false);
      try { localStorage.removeItem(LS_KEY); } catch {}
    }, []);
  
    const value = useMemo<TransactionsContextValue>(() => ({
      transactions, loading, error, lastLoadedAt, refresh, save, remove, clear,
    }), [transactions, loading, error, lastLoadedAt, refresh, save, remove, clear]);
  
    return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
  }
  
  export function useTransactions() {
    const ctx = useContext(TransactionsContext);
    if (!ctx) throw new Error("useTransactions must be used within a TransactionsProvider");
    return ctx;
  }
  