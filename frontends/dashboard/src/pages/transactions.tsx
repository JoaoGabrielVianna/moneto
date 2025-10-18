// src/pages/transactions.tsx
import { CreditCard, DollarSign, Edit2Icon, Plus, Trash2Icon, TrendingUp, Search, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import TransactionModal from "../components/transaction_modal";
import type { Transaction } from "../models/transaction";
import { formatBRL } from "../utils/money";

import { filterAndSortTransactions, totals, type Tab } from "../selectors/transactions";
import { useCategories } from "../contexts/categoryContext";
import { CategoryBadge } from "../components/categoryBadge";
import { useTransactions } from "../contexts/transactionsContext";
import { formatDateBRSafe, getDateRangeYMD } from "../utils/date";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | string>("all");

  // filtros de data
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // dados
  const { transactions, loading, error, save, remove } = useTransactions();
  const { categories, loading: catLoading } = useCategories();

  // lookup de nome de categoria
  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  // calcula range de data (YYYY-MM-DD)
  const dateRangeYMD = useMemo(
    () => getDateRangeYMD(dateFilter, customStartDate, customEndDate),
    [dateFilter, customStartDate, customEndDate]
  );

  const filteredTransactions = useMemo(
    () =>
      filterAndSortTransactions(transactions, {
        tab: activeTab,
        searchTerm,
        categoryId: filterCategory,
        categoryNameById,
        dateRangeYMD, // aplica o período
      }),
    [transactions, activeTab, searchTerm, filterCategory, categoryNameById, dateRangeYMD]
  );

  // Totais — se quiser que respeitem o período, use filtered quando há range
// Totais SEMPRE com base nas transações filtradas (aba, busca, categoria e período)
const { income: totalIncome, expense: totalExpenses, balance } = useMemo(
  () => totals(filteredTransactions),
  [filteredTransactions]
);


  // ações
  const handleCreate = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (t: Transaction) => {
    if (!confirm("Excluir essa transação?")) return;
    try {
      await remove(t);
    } catch (e: any) {
      alert(e?.message || "Erro ao excluir.");
    }
  };

  const handleSave = async (payload: Transaction) => {
    try {
      await save(payload);
      setShowForm(false);
      setEditingTransaction(null);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Erro ao salvar transação.");
    }
  };

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-100">Transações</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg border border-gray-700"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{dateFilter !== "all" ? "Receitas (Período)" : "Total Receitas"}</p>
              <p className="text-2xl font-semibold text-emerald-400">{formatBRL(totalIncome)}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{dateFilter !== "all" ? "Despesas (Período)" : "Total Despesas"}</p>
              <p className="text-2xl font-semibold text-red-400">{formatBRL(totalExpenses)}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl">
              <CreditCard className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{dateFilter !== "all" ? "Saldo (Período)" : "Saldo"}</p>
              <p className={`text-2xl font-semibold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatBRL(balance)}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${balance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
              <TrendingUp className={`h-6 w-6 ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1">
        <div className="flex space-x-1">
          {[
            { id: "all", label: "Todas" },
            { id: "income", label: "Receitas" },
            { id: "expense", label: "Despesas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id ? "bg-gray-800 text-gray-100 shadow-lg" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filters */}
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Período</span>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "week" | "month" | "custom")}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Todos os períodos</option>
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="custom">Período personalizado</option>
          </select>

          {dateFilter === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data início</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data fim</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">Lista de Transações ({filteredTransactions.length})</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {loading || catLoading ? (
            <p className="text-gray-400 p-6">Carregando…</p>
          ) : error ? (
            <p className="text-red-400 p-6">{error}</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-gray-400 p-6 text-center">Nenhuma transação encontrada.</p>
          ) : (
            filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 hover:bg-gray-800 transition-colors duration-200"
              >
                {/* Esquerda */}
                <div className="flex items-start md:items-center gap-4">
                  <div className={`p-2 rounded-xl ${t.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                    {t.type === "income" ? (
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200">{t.description || "Sem descrição"}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <CategoryBadge categoryId={t.categoryId} />
                      <span className="text-xs text-gray-400">{formatDateBRSafe(t.date)}</span>
                    </div>
                    {t.notes && <p className="text-sm text-gray-400 mt-1">{t.notes}</p>}
                  </div>
                </div>

                {/* Direita */}
                <div className="flex items-center gap-4 md:ml-auto">
                  <span className={`text-lg font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"}
                    {formatBRL(Number(t.amount || 0))}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-gray-700 transition" onClick={() => handleEdit(t)} title="Editar">
                      <Edit2Icon color="#3B82F6" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-700 transition" onClick={() => handleDelete(t)} title="Excluir">
                      <Trash2Icon color="#EF4444" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <TransactionModal setShowForm={setShowForm} transaction={editingTransaction} onSave={handleSave} />
      )}
    </main>
  );
}
