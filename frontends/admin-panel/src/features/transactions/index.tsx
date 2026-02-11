import { HeaderPage } from "@/components/header-page"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { Plus, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useTransactionContext } from "@/context/transactions-provider"
import { useCategoryContext } from "@/context/category-provider"

import { TransactionDeleteDialog } from "./components/transaction-delete-dialog"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { TransactionActionDialog } from "./components/transaction-action-dialog"
import { ImportCSVDialog } from "@/components/import-csv-dialog"

export default function TransactionsPage() {
  const { transactions } = useTransactionContext()
  const { categories } = useCategoryContext()

  const [openDialog, setOpenDialog] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openImport, setOpenImport] = useState(false)

  const handleNew = () => {
    setEditingTransaction(null)
    setOpenDialog(true)
  }

  const handleEdit = (tx: any) => {
    setEditingTransaction(tx)
    setOpenDialog(true)
  }

  const handleDelete = (tx: any) => {
    setSelectedTransaction(tx)
    setOpenDelete(true)
  }

  // ✅ Enriquecer transações com dados da categoria
  const transactionsWithCategory = useMemo(() => {
    return transactions.map((tx) => {
      const cat = categories.find((c) => c.id === tx.category_id)
      return {
        ...tx,
        categoryName: cat?.name ?? "Sem categoria",
        categoryColor: cat?.color ?? "#555",
      }
    })
  }, [transactions, categories])

  // ✅ Filtrar pela descrição
  const filteredTransactions = transactionsWithCategory.filter((t) =>
    (t.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Transações"
        subtitle="Gerencie suas receitas e despesas."
      >
        <Button variant="outline" onClick={() => setOpenImport(true)}>
          <Upload className="mr-2 h-4 w-4" /> Importar CSV
        </Button>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </HeaderPage>

      <div className="space-y-6">
        <Input
          placeholder="Buscar transações..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Separator className="shadow-sm" />
      </div>

      {/* ✅ Agora os dados vêm enriquecidos */}
      <DataTable columns={columns(handleEdit, handleDelete)} data={filteredTransactions} />

      <TransactionActionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        currentTransaction={editingTransaction || undefined}
      />

      {selectedTransaction && (
        <TransactionDeleteDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          transaction={selectedTransaction}
        />
      )}

      <ImportCSVDialog open={openImport} onOpenChange={setOpenImport} />
    </div>
  )
}
