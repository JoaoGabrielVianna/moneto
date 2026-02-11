
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
type JsonBody = Record<string, any> | FormData | undefined


const SERVICE_URLS: Record<string, string> = {
  user: getBaseUrl("USER_SERVICE_PORT"),
  income: getBaseUrl("INCOME_SERVICE_PORT"),
  expense: getBaseUrl("EXPENSE_SERVICE_PORT"),
  category: getBaseUrl("CATEGORY_SERVICE_PORT"),
  dashboard: getBaseUrl("DASHBOARD_SERVICE_PORT"),
  import: getBaseUrl("IMPORT_SERVICE_PORT"), 

}

function getBaseUrl(envKey: string): string {
  const port = import.meta.env[`VITE_${envKey}`]
  return `http://localhost:${port}`
}

function getAuthToken(): string | null {
  return localStorage.getItem("token")
}

async function http<T = any>(
  method: HttpMethod,
  url: string,
  body?: JsonBody,
  opts?: { base?: string; timeoutMs?: number }
): Promise<T> {
  const { base = "", timeoutMs = 8000 } = opts || {}
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const headers: HeadersInit = {}
    const token = getAuthToken()

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(base + url, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`[${res.status}] ${text || res.statusText}`)
    }

    const contentType = res.headers.get("content-type")
    return contentType?.includes("application/json")
      ? await res.json()
      : ((await res.text()) as unknown as T)
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("Tempo limite da requisição")
    throw err
  }
}


/* ------------------------------------------------------
   🔹 Instâncias utilitárias para cada serviço
------------------------------------------------------ */

export const userApi = {
  get: <T>(url: string) => http<T>("GET", url, undefined, { base: SERVICE_URLS.user }),
  post: <T>(url: string, body: JsonBody) => http<T>("POST", url, body, { base: SERVICE_URLS.user }),
  put: <T>(url: string, body: JsonBody) => http<T>("PUT", url, body, { base: SERVICE_URLS.user }),
  delete: <T>(url: string) => http<T>("DELETE", url, undefined, { base: SERVICE_URLS.user }),
}

export const incomeApi = {
  get: <T>(url: string) => http<T>("GET", url, undefined, { base: SERVICE_URLS.income }),
  post: <T>(url: string, body: JsonBody) => http<T>("POST", url, body, { base: SERVICE_URLS.income }),
  put: <T>(url: string, body: JsonBody) => http<T>("PUT", url, body, { base: SERVICE_URLS.income }),
  delete: <T>(url: string) => http<T>("DELETE", url, undefined, { base: SERVICE_URLS.income }),
}

export const expenseApi = {
  get: <T>(url: string) => http<T>("GET", url, undefined, { base: SERVICE_URLS.expense }),
  post: <T>(url: string, body: JsonBody) => http<T>("POST", url, body, { base: SERVICE_URLS.expense }),
  put: <T>(url: string, body: JsonBody) => http<T>("PUT", url, body, { base: SERVICE_URLS.expense }),
  delete: <T>(url: string) => http<T>("DELETE", url, undefined, { base: SERVICE_URLS.expense }),
}

export const categoryApi = {
  get: <T>(url: string) => http<T>("GET", url, undefined, { base: SERVICE_URLS.category }),
  post: <T>(url: string, body: JsonBody) => http<T>("POST", url, body, { base: SERVICE_URLS.category }),
  put: <T>(url: string, body: JsonBody) => http<T>("PUT", url, body, { base: SERVICE_URLS.category }),
  delete: <T>(url: string) => http<T>("DELETE", url, undefined, { base: SERVICE_URLS.category }),
}

export const dashboardApi = {
  get: <T>(url: string) => http<T>("GET", url, undefined, { base: SERVICE_URLS.dashboard }),
  post: <T>(url: string, body: JsonBody) => http<T>("POST", url, body, { base: SERVICE_URLS.dashboard }),
  put: <T>(url: string, body: JsonBody) => http<T>("PUT", url, body, { base: SERVICE_URLS.dashboard }),
  delete: <T>(url: string) => http<T>("DELETE", url, undefined, { base: SERVICE_URLS.dashboard }),
}

export const importApi = {
  post: <T>(url: string, body: JsonBody) =>
    http<T>("POST", url, body, { base: SERVICE_URLS.import }),
}
