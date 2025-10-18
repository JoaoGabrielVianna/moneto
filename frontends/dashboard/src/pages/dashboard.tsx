import { useMemo, useState } from "react";
import { useTransactions } from "../contexts/transactionsContext";
import { useCategories } from "../contexts/categoryContext";
import { formatBRL } from "../utils/money";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, DollarSign, CreditCard } from "lucide-react";

const PT_BR_MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

// === helpers ===
// Substitua sua função por esta
function parseAmount(a: any): number {
  if (typeof a === "number") return Number.isFinite(a) ? a : 0;
  if (typeof a !== "string") return 0;

  const s = a.trim();
  if (!s) return 0;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  // Tem vírgula e ponto: decide pelo último separador quem é decimal
  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    if (lastComma > lastDot) {
      // vírgula é decimal:  "15.000,00" -> "15000.00"
      const normalized = s.replace(/\./g, "").replace(",", ".");
      const n = Number(normalized);
      return Number.isFinite(n) ? n : 0;
    } else {
      // ponto é decimal: "15,000.00" -> "15000.00"
      const normalized = s.replace(/,/g, "");
      const n = Number(normalized);
      return Number.isFinite(n) ? n : 0;
    }
  }

  // Só vírgula: assume decimal BR
  if (hasComma) {
    const normalized = s.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  // Só ponto: assume decimal EN
  if (hasDot) {
    const normalized = s.replace(/,/g, "");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  // Sem separador
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}


function safeDate(v: any): Date {
  if (!v) return new Date(NaN);

  // se já for Date
  if (v instanceof Date) return v;

  // se for número (timestamp)
  if (typeof v === "number") return new Date(v);

  // se for string
  if (typeof v === "string") {
    // remove timezone se tiver, força parse local
    const normalized = v.replace("T", " ").replace("Z", "");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? new Date(NaN) : d;
  }

  return new Date(NaN);
}



function monthKeyLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function startOfMonthLocal(y: number, m: number) {
  return new Date(y, m, 1, 0, 0, 0);
}
function addMonthsLocal(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export default function Dashboard() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  const [range, setRange] = useState<"1m" | "6m" | "1y">("6m");
  const RANGE_MONTHS = { "1m": 1, "6m": 6, "1y": 12 };

  // remove duplicatas
  const cleanTransactions = useMemo(() => {
    const seen = new Set<string>();
    return transactions.filter((t: any) => {
      const key =
        (t.id ? `id:${t.id}` : `d:${t.date}|a:${t.amount}|desc:${t.description}`) +
        `|type:${t.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [transactions]);

  // limita por período
  const filteredTx = useMemo(() => {
    const monthsBack = RANGE_MONTHS[range];
    const now = new Date();
    const start = addMonthsLocal(startOfMonthLocal(now.getFullYear(), now.getMonth()), -(monthsBack - 1));
    const end = addMonthsLocal(startOfMonthLocal(now.getFullYear(), now.getMonth()), 1);

    return cleanTransactions.filter((t: any) => {
      const d = safeDate(t.date);
      if (isNaN(d.getTime())) return false;
      return d >= start && d < end;
    });
  }, [cleanTransactions, range]);

  // buckets mensais
  const monthlyData = useMemo(() => {
    const monthsBack = RANGE_MONTHS[range];
    const now = new Date();
    const baseYear = now.getFullYear();
    const baseMonth = now.getMonth();

    const buckets: Record<string, any> = {};
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(baseYear, baseMonth - i, 1);
      const key = monthKeyLocal(d);
      buckets[key] = { key, month: PT_BR_MONTHS[d.getMonth()], income: 0, expenses: 0 };
    }

    filteredTx.forEach((t: any) => {
      const d = safeDate(t.date);
      if (isNaN(d.getTime())) return;
      const key = monthKeyLocal(d);
      const bucket = buckets[key];
      if (!bucket) return;
      const val = parseAmount(t.amount);
      if (!Number.isFinite(val) || val <= 0) return;
      if (t.type === "income") bucket.income += val;
      else if (t.type === "expense") bucket.expenses += val;
    });

    return Object.values(buckets);
  }, [filteredTx, range]);

  // cards
  const totalIncome = useMemo(
    () => filteredTx.filter((t: any) => t.type === "income").reduce((s: number, t: any) => s + parseAmount(t.amount), 0),
    [filteredTx]
  );
  const totalExpenses = useMemo(
    () => filteredTx.filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + parseAmount(t.amount), 0),
    [filteredTx]
  );
  const balance = totalIncome - totalExpenses;

  const maxValueDisplay = Math.max(1, ...monthlyData.flatMap((d: any) => [d.income, d.expenses]));

  // pizza por categoria
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    filteredTx.forEach((t: any) => {
      if (t.type !== "expense") return;
      const val = parseAmount(t.amount);
      if (!Number.isFinite(val) || val <= 0) return;
      map.set(t.categoryId, (map.get(t.categoryId) || 0) + val);
    });

    const items = Array.from(map.entries()).map(([id, amount]) => {
      const cat = categories.find((c: any) => c.id === id);
      return { name: cat?.name ?? "Sem categoria", value: amount };
    });

    return items.filter((x) => x.value > 0);
  }, [filteredTx, categories]);

  const COLORS = ["#22c55e","#ef4444","#f59e0b","#06b6d4","#8b5cf6","#84cc16","#eab308","#10b981"];

  return (
    <main className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-gray-100">Visão Geral</h2>
      </div>

      {/* === Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receitas */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Receitas no Período</p>
              <h3 className="text-2xl font-bold text-emerald-400">{formatBRL(totalIncome)}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-end space-x-1 h-16 mt-2">
            {monthlyData.map((m: any, i: number) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-emerald-500/40 hover:bg-emerald-500/70 transition-all"
                style={{ height: `${(m.income / maxValueDisplay) * 100}%` }}
                title={`${m.month}: ${formatBRL(m.income)}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {monthlyData.map((m: any) => <span key={m.key}>{m.month}</span>)}
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Despesas no Período</p>
              <h3 className="text-2xl font-bold text-red-400">{formatBRL(totalExpenses)}</h3>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl">
              <CreditCard className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="flex items-end space-x-1 h-16 mt-2">
            {monthlyData.map((m: any, i: number) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-red-500/40 hover:bg-red-500/70 transition-all"
                style={{ height: `${(m.expenses / maxValueDisplay) * 100}%` }}
                title={`${m.month}: ${formatBRL(m.expenses)}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {monthlyData.map((m: any) => <span key={m.key}>{m.month}</span>)}
          </div>
        </div>

        {/* Saldo */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Saldo no Período</p>
              <h3 className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatBRL(balance)}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${balance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
              <TrendingUp className={`h-6 w-6 ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#e5e7eb" }}
                formatter={(v: number) => formatBRL(v)}
              />
              <Line type="monotone" dataKey={(d: any) => d.income - d.expenses} stroke={balance >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === Filtro === */}
      <div className="flex justify-end space-x-2">
        {[{label:"1 Mês",value:"1m"},{label:"6 Meses",value:"6m"},{label:"1 Ano",value:"1y"}].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setRange(btn.value as "1m"|"6m"|"1y")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              range === btn.value ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* === Gráficos === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Evolução Financeira ({range === "1y" ? "1 Ano" : range === "1m" ? "1 Mês" : "6 Meses"})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#e5e7eb" }}
                formatter={(v: number) => formatBRL(v)}
              />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-400">Sem despesas no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#e5e7eb" }}
                  formatter={(v: number) => formatBRL(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </main>
  );
}
