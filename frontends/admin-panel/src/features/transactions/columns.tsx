import { type ColumnDef } from "@tanstack/react-table"
import type { Transaction } from "@/types/transaction"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"

export function columns(
  onEdit: (tx: Transaction) => void,
  onDelete: (tx: Transaction) => void
): ColumnDef<Transaction & {
  categoryName?: string
  categoryColor?: string
}>[] {
  return [
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.description}</span>
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Categoria",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: row.original.categoryColor }}
          />
          <span className="text-sm">{row.original.categoryName}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => (
        <span>{new Date(row.original.date).toLocaleDateString("pt-BR")}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => {
        const value = Number(row.original.amount)
        const formatted = value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
        const color =
          row.original.type === "income" ? "text-emerald-400" : "text-red-400"
        return <span className={`font-semibold ${color}`}>{formatted}</span>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Edit2 className="h-4 w-4 text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ]
}
