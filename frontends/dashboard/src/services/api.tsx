const API_BASE_INCOMES = "http://localhost:3002";
const API_BASE_EXPENSES = "http://localhost:3003";
const API_BASE_CATEGORY = "http://localhost:3004";
const API_BASE_USERS = "http://localhost:3001";    // <— ajuste a porta se necessário
type RequestOptions = RequestInit & { timeoutMs?: number };

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      credentials: "include",
      signal: controller.signal,
      ...options,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message = data?.message || data?.error || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(message);
    }
    return data as T;
  } catch (err: any) {
    if (err?.name === "AbortError") throw new Error("Tempo de requisição excedido.");
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export { API_BASE_INCOMES, API_BASE_EXPENSES, API_BASE_CATEGORY, API_BASE_USERS, request };
