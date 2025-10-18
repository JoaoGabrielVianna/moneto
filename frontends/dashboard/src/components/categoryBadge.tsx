import { useCategories } from "../contexts/categoryContext";

export function CategoryBadge({ categoryId }: { categoryId: string }) {
  const { categories } = useCategories();
  const cat = categories.find((c) => c.id === categoryId);

  if (!cat) {
    return (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-lg bg-gray-700/50 text-gray-300">
        Sem categoria
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-lg bg-gray-800 text-gray-200 border border-gray-700">
      <span className={`w-2 h-2 rounded-full ${cat.color}`} />
      {cat.name}
    </span>
  );
}
