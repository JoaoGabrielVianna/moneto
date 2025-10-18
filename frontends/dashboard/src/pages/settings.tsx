// ===============================|
// Imports
// ===============================
import { Edit, Tag, Trash2, Plus, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Category } from "../models/category";
import { useCategories } from "../contexts/categoryContext";
import { useUser } from "../contexts/userContext";

// Paleta de cores para categorias
const colorOptions = [
  { name: "Vermelho", value: "bg-red-500" },
  { name: "Laranja", value: "bg-orange-500" },
  { name: "Amarelo", value: "bg-yellow-500" },
  { name: "Verde", value: "bg-emerald-500" },
  { name: "Azul", value: "bg-blue-500" },
  { name: "Índigo", value: "bg-indigo-500" },
  { name: "Roxo", value: "bg-purple-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Ciano", value: "bg-cyan-500" },
];

// ===============================|
// Page
// ===============================
export default function SettingsPage() {
  // -------------------------------|
  // User (Provider)
  // -------------------------------|
  const { user, loading: userLoading, error: userError, update: updateUser } = useUser();
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, email: user.email });
  }, [user]);

  const profileDirty = useMemo(() => {
    if (!user) return false;
    return user.name !== profileForm.name || user.email !== profileForm.email;
  }, [user, profileForm]);

  const handleProfileUpdate = (field: "name" | "email", value: string) =>
    setProfileForm((prev) => ({ ...prev, [field]: value }));

  const handleSaveProfile = async () => {
    if (!user || !profileDirty) return;
    setSavingProfile(true);
    const ok = await updateUser({
      name: user.name !== profileForm.name ? profileForm.name : undefined,
      email: user.email !== profileForm.email ? profileForm.email : undefined,
    });
    setSavingProfile(false);
    if (ok) alert("Perfil atualizado!");
  };

  // -------------------------------|
  // Categories (Provider)
  // -------------------------------|
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();

  // -------------------------------|
  // Category form state
  // -------------------------------|
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<{
    name: string;
    color: string;
    type: "income" | "expense" | "both";
    description: string;
  }>({ name: "", color: "", type: "expense", description: "" });

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: "", color: "", type: "expense", description: "" });
    setShowCategoryForm(false);
  };

  // -------------------------------|
  // Category handlers
  // -------------------------------|
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const exists = categories.find(
      (c) =>
        c.name.trim().toLowerCase() === categoryFormData.name.trim().toLowerCase() &&
        c.id !== editingCategory?.id
    );
    if (exists) {
      alert("Já existe uma categoria com este nome!");
      return;
    }

    if (editingCategory) {
      const ok = await updateCategory(editingCategory.id, {
        name: categoryFormData.name,
        color: categoryFormData.color,
        type: categoryFormData.type,
        description: categoryFormData.description,
      });
      if (ok) resetCategoryForm();
    } else {
      const ok = await createCategory({
        name: categoryFormData.name,
        color: categoryFormData.color,
        type: categoryFormData.type,
        description: categoryFormData.description,
      });
      if (ok) resetCategoryForm();
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      color: cat.color,
      type: (cat.type as "income" | "expense" | "both") ?? "expense",
      description: cat.description || "",
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Excluir esta categoria?")) return;
    await deleteCategory(id);
  };

  // ===============================|
  // Render
  // ===============================
  return (
    <main className="space-y-6">
      {/* ===============================|
          Profile Settings
          =============================== */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <User className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Perfil</h3>
        </div>

        {userLoading ? (
          <div className="text-gray-400">Carregando…</div>
        ) : userError ? (
          <div className="text-red-400">Erro: {userError}</div>
        ) : !user ? (
          <div className="text-gray-400">Usuário não encontrado.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => handleProfileUpdate("name", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => handleProfileUpdate("email", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={!profileDirty || savingProfile}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg ${
                  !profileDirty || savingProfile
                    ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <span>{savingProfile ? "Salvando..." : "Salvar Perfil"}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===============================|
          Category Management
          =============================== */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Tag className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Gerenciar Categorias</h3>
          </div>
          <button
            onClick={() => (showCategoryForm ? resetCategoryForm() : setShowCategoryForm(true))}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg border border-gray-700"
          >
            <Plus className="h-4 w-4" />
            <span>{showCategoryForm ? "Cancelar" : "Nova Categoria"}</span>
          </button>
        </div>

        {/* Form de Categoria */}
        {showCategoryForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <h4 className="text-md font-semibold text-gray-200 mb-4">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </h4>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Categoria</label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: Alimentação, Transporte, Salário..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                  <select
                    required
                    value={categoryFormData.type}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        type: e.target.value as "income" | "expense" | "both",
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cor da Categoria</label>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setCategoryFormData({ ...categoryFormData, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} border-2 transition-all duration-200 ${
                        categoryFormData.color === color.value ? "border-gray-300 scale-110 shadow-lg" : "border-gray-600 hover:scale-105"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição (opcional)</label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Descrição da categoria..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  {editingCategory ? "Atualizar" : "Adicionar"} Categoria
                </button>
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="text-gray-400">Carregando…</div>
          ) : error ? (
            <div className="text-red-400">Erro: {error}</div>
          ) : categories.length === 0 ? (
            <div className="text-gray-400">Sem categorias ainda.</div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:bg-gray-750 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`} />
                    <div>
                      <h4 className="font-medium text-gray-200">{category.name}</h4>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {category.description && <p className="text-sm text-gray-400 mb-2">{category.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Criada em</span>
                  <span>{category.created_at ? new Date(category.created_at).toLocaleDateString("pt-BR") : "—"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
