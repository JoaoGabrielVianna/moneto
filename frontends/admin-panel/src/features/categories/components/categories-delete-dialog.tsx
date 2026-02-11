import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useCategoryContext } from "@/context/category-provider"
import { Separator } from "@/components/ui/separator"

type CategoryDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: {
        id: string
        name: string
    }
}

export function CategoryDeleteDialog({
    open,
    onOpenChange,
    category,
}: CategoryDeleteDialogProps) {
    const [value, setValue] = useState("")
    const { remove } = useCategoryContext()

    const handleDelete = async () => {
        if (value.trim() !== category.name) return

        try {
            await remove(category.id)
            onOpenChange(false)
        } catch (error) {
            console.error("Erro ao remover categoria:", error)
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== category.name}
            title={
                <span className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="stroke-destructive h-5 w-5" />
                    Excluir Categoria
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p className="mb-2 text-sm">
                        Tem certeza de que deseja excluir a categoria{" "}
                        <span className="font-semibold">{category.name}</span>?
                        <br />
                        Esta ação é permanente e não poderá ser desfeita.
                    </p>

                    <Label className="my-2 text-sm">
                        Digite o nome da categoria para confirmar:
                    </Label>

                    <Separator className='shadow-sm my-4' />
                    
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={category.name}
                    />

                    <Alert variant="destructive">
                        <AlertTitle>Atenção!</AlertTitle>
                        <AlertDescription>
                            Esta ação é irreversível. Todos os registros associados a esta
                            categoria podem ser impactados.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText="Excluir"
            destructive
        />
    )
}
