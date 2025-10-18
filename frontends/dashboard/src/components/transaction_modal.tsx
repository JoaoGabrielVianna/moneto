import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Transaction } from "../models/transaction";
import { useCategories } from "../contexts/categoryContext";

interface TransactionModalProps {
  setShowForm: (value: boolean) => void;
  transaction?: Transaction | null;
  onSave: (transaction: Transaction) => void;
}

function toInputDate(d: Date | string | undefined): string {
  const date = d instanceof Date ? d : d ? new Date(d) : new Date();
  // yyyy-mm-dd
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function TransactionModal({ setShowForm, transaction, onSave }: TransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: toInputDate(new Date()),
    category_id: "",
    type: "expense" as "income" | "expense",
    notes: "",
  });

  const { categories, loading } = useCategories();


  const filtered = categories.filter(c => c.type === formData.type || c.type === "both");


  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || "",
        amount: transaction.amount?.toString() || "",
        date: toInputDate(transaction.date),
        category_id: transaction.categoryId || "",
        type: transaction.type,
        notes: transaction.notes || "",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        date: toInputDate(new Date()),
        category_id: "",
        type: "expense",
        notes: "",
      });
    }
  }, [transaction]);

  const close = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // monta o Transaction no teu modelo (amount string, datas Date)
      const payload: Transaction = {
        id: transaction?.id ?? crypto.randomUUID(),
        userId: transaction?.userId ?? "",          // preenche se tiver user no contexto
        categoryId: formData.category_id || "",
        amount: formData.amount,                    // string
        description: formData.description,
        date: new Date(formData.date),              // Date
        notes: formData.notes,
        createdAt: transaction?.createdAt ?? new Date(),
        updatedAt: new Date(),
        type: formData.type,
      };

      await onSave(payload);
      close();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao salvar transação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-100">
            {transaction ? "Editar Transação" : "Nova Transação"}
          </h3>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
                disabled={!!transaction}   // ← trava quando for edição
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Descrição da transação..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Categoria (placeholder até ligar Category Service) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria (opcional)</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200"
                required
              >
                <option value="">Selecione uma categoria</option>
                {filtered.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações (opcional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg flex-1"
            >
              {isLoading ? "Salvando..." : transaction ? "Atualizar" : "Adicionar"} Transação
            </button>
            <button
              type="button"
              onClick={close}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-3 rounded-xl transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
