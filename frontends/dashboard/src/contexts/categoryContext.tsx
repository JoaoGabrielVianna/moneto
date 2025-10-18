import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Category } from "../models/category";
import { CategoryService } from "../services/category_service";

type CategoryContextValue = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createCategory: (data: Omit<Category, "id" | "created_at" | "updated_at">) => Promise<Category | null>;
  updateCategory: (id: string, data: Partial<Omit<Category, "id">>) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  getById: (id: string) => Category | undefined;
  getByType: (type: "income" | "expense" | "both") => Category[];
};

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

// opcional: cache leve em localStorage pra não piscar lista em cada reload
const LS_KEY = "moneto.categories.v1";

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Category[]) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(categories.length === 0);
  const [error, setError] = useState<string | null>(null);

  const persist = (cats: Category[]) => {
    setCategories(cats);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cats));
    } catch {
      /* ignore quota */
    }
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoryService.list();
      persist(data);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // carrega na entrada se não tiver cache
    if (categories.length === 0) {
      refresh();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // se o token mudar (login/logout), refaz o fetch
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const getById = useCallback((id: string) => categories.find(c => c.id === id), [categories]);

  const getByType = useCallback(
    (type: "income" | "expense" | "both") =>
      categories.filter(c => c.type === type || c.type === "both"),
    [categories]
  );

  const createCategory = useCallback(
    async (data: Omit<Category, "id" | "created_at" | "updated_at">) => {
      // otimista
      const temp: Category = {
        id: `tmp_${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      persist([temp, ...categories]);
      try {
        const created = await CategoryService.create(data);
        persist([created, ...categories]); // substitui o temp por created
        return created;
      } catch (e) {
        // rollback
        persist(categories);
        setError((e as any)?.message || "Erro ao criar categoria");
        return null;
      }
    },
    [categories]
  );

  const updateCategory = useCallback(
    async (id: string, data: Partial<Omit<Category, "id">>) => {
      const prev = categories;
      const optimistic = prev.map(c => (c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } as Category : c));
      persist(optimistic);
      try {
        const updated = await CategoryService.update(id, data);
        persist(prev.map(c => (c.id === id ? updated : c)));
        return updated;
      } catch (e) {
        persist(prev); // rollback
        setError((e as any)?.message || "Erro ao atualizar categoria");
        return null;
      }
    },
    [categories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      const prev = categories;
      persist(prev.filter(c => c.id !== id));
      try {
        await CategoryService.remove(id);
        return true;
      } catch (e) {
        persist(prev); // rollback
        setError((e as any)?.message || "Erro ao excluir categoria");
        return false;
      }
    },
    [categories]
  );

  const value = useMemo<CategoryContextValue>(
    () => ({
      categories,
      loading,
      error,
      refresh,
      createCategory,
      updateCategory,
      deleteCategory,
      getById,
      getByType,
    }),
    [categories, loading, error, refresh, createCategory, updateCategory, deleteCategory, getById, getByType]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be used within a CategoryProvider");
  return ctx;
}
