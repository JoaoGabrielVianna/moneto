// src/utils/date.ts
export type DateRangeYMD = { startYMD: string; endYMD: string };

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const ymdFromDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Converte Date | ISO | YYYY-MM-DD -> 'YYYY-MM-DD' */
export function ymdOf(d: Date | string): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return d.slice(0, 10);
}

/** Calcula o range por tipo de filtro (em YYYY-MM-DD). Retorna null para "all". */
export function getDateRangeYMD(
  filter: "all" | "today" | "week" | "month" | "custom",
  customStart?: string,
  customEnd?: string
): DateRangeYMD | null {
  if (filter === "all") return null;

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (filter === "today") {
    const ymd = ymdFromDate(startOfDay);
    return { startYMD: ymd, endYMD: ymd };
  }

  if (filter === "week") {
    const start = new Date(startOfDay);
    // domingo como início da semana
    start.setDate(startOfDay.getDate() - startOfDay.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startYMD: ymdFromDate(start), endYMD: ymdFromDate(end) };
  }

  if (filter === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { startYMD: ymdFromDate(start), endYMD: ymdFromDate(end) };
  }

  // custom
  if (customStart && customEnd) {
    return { startYMD: customStart.slice(0, 10), endYMD: customEnd.slice(0, 10) };
  }
  return null;
}

// --- utilitários que você já tinha ---
export function toDateSafe(v: string | Date | null | undefined): Date {
  if (!v) return new Date(0);
  return v instanceof Date ? v : new Date(v);
}

export function toISODateString(d: Date): string {
  return new Date(d).toISOString();
}

export function formatDateBRSafe(d: Date | string): string {
  try {
    const date = d instanceof Date ? d : new Date(d);
    // Formata fixando UTC pra evitar “voltar um dia” por fuso
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
  } catch {
    // fallback: se vier "YYYY-MM-DD"
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d)) {
      const [y, m, day] = d.slice(0, 10).split("-");
      return `${day}/${m}/${y}`;
    }
    return "";
  }
}
