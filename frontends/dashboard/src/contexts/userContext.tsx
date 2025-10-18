import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User, UserUpdatePayload } from "../models/user";
import { UserService } from "../services/user_service";

type UserContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  update: (payload: UserUpdatePayload) => Promise<boolean>;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

// cache leve p/ evitar “flash” em reloads
const LS_KEY = "moneto.user.v1";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(!user);
  const [error, setError] = useState<string | null>(null);

  const persist = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
      else localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend preenche user_id a partir do token (rota protegida /users/me)
      const me = await UserService.me();
      persist(me);
    } catch (e: any) {
      persist(null);
      setError(e?.message || "Erro ao carregar usuário");
    } finally {
      setLoading(false);
    }
  }, []);

  // carrega na entrada se houver token
  useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    if (hasToken && !user) {
      refresh();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // se o token mudar (login/logout em outra aba), refaz o fetch/limpa
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        if (e.newValue) refresh();
        else persist(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const update = useCallback(
    async (payload: UserUpdatePayload) => {
      if (!user) return false;
      try {
        const updated = await UserService.update(user.id, payload);
        persist(updated);
        return true;
      } catch (e: any) {
        setError(e?.message || "Erro ao atualizar usuário");
        return false;
      }
    },
    [user]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    persist(null);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ user, loading, error, refresh, update, logout }),
    [user, loading, error, refresh, update, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
