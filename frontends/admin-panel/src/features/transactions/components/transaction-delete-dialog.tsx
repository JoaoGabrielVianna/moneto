import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransactionContext } from "@/context/transactions-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: {
    id: string
    description: string
    type: "income" | "expense"
  }
}

export function TransactionDeleteDialog({ open, onOpenChange, transaction }: Props) {
  const [value, setValue] = useState("")
  const { remove } = useTransactionContext()

  const handleDelete = async () => {
    if (value.trim() !== transaction.description) return
    await remove(transaction.id, transaction.type)
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== transaction.description}
      title={
        <span className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Excluir Transação
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="text-sm">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold">{transaction.description}</span>?
            <br />
            Essa ação é permanente e não poderá ser desfeita.
          </p>
          <Label className="text-sm">Digite o nome da transação para confirmar:</Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={transaction.description}
          />
          <Alert variant="destructive">
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Esta ação é irreversível e removerá os dados permanentemente.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Excluir"
      destructive
    />
  )
}
