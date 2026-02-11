import { Input } from "@/components/ui/input"
import { SelectFilter, type SelectFilterItem } from "../select-filter"
import { Tag } from "lucide-react"
import { normalizeHexColor } from "@/lib/colorUtils"
import type { Category } from "@/types/category"

type Props = {
  searchTerm: string
  setSearchTerm: (v: string) => void
  selectedCategories: string[]
  setSelectedCategories: (v: string[]) => void
  categories: Category[]
}

export function TransactionFilters({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  categories,
}: Props) {
  const categoryItems: SelectFilterItem[] = categories.map((cat) => {
    const color = normalizeHexColor(cat.color)
    return {
      label: cat.name,
      value: cat.id,
      icon: <Tag className="h-4 w-4" style={{ color }} />,
    }
  })

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Buscar transações..."
        className="max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SelectFilter
        label="Categoria"
        items={categoryItems}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />
    </div>
  )
}
