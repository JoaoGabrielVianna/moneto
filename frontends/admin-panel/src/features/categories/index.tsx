import { HeaderPage } from "@/components/header-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCategoryContext } from "@/context/category-provider"
import { Edit2, Tag, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { CategoryActionDialog } from "./components/category-action-dialog"
import { CategoryDeleteDialog } from "./components/categories-delete-dialog"


export default function CategoriesPage() {
    const { categories } = useCategoryContext()
    const [searchTerm, setSearchTerm] = useState("")

    const [openDialog, setOpenDialog] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null)
    const [openDelete, setOpenDelete] = useState(false)
    const filteredCategories = categories.filter((c) =>
        (c.description || c.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )


    const handleNew = () => {
        setEditingCategory(null)
        setOpenDialog(true)
    }

    const handleEdit = (cat: any) => {
        setEditingCategory(cat)
        setOpenDialog(true)
    }

    const handleDelete = (cat: { id: string; name: string }) => {
        setSelectedCategory(cat)
        setOpenDelete(true)
    }

    return (
        <div className="space-y-6">
            {/* 🔹 Cabeçalho da página */}
            <HeaderPage title="Categorias" subtitle="Gerencie e organize suas categorias financeiras.">
                <Button onClick={handleNew}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Categoria
                </Button>

            </HeaderPage>
            <Input
                placeholder="Buscar transações..."
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Separator className='shadow-sm' />

            <ScrollArea className="h-[70vh] rounded-md pr-4">

                {/* 🔹 Grade de categorias */}
                {filteredCategories.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((cat, i) => (
                            <Card
                                key={cat.id ?? i}
                                className="group relative border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:shadow-md"
                            >
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex h-8 w-8 items-center justify-center rounded-lg"
                                            style={{ backgroundColor: cat.color || "#555" }}
                                        >
                                            <Tag className="h-4 w-4 text-white opacity-90" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-medium leading-tight">
                                                {cat.name}
                                            </CardTitle>
                                            <CardDescription className="text-xs text-muted-foreground capitalize">
                                                {cat.type}
                                            </CardDescription>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                                            <Edit2 className="h-4 w-4 text-blue-400" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)}>
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {cat.description ? (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {cat.description}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Sem descrição</p>
                                    )}
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Criada em {formatDateBRSafe(cat.created_at)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-10 text-center border-dashed border-muted-foreground/20 bg-muted/10">
                        <p className="text-sm text-muted-foreground">
                            Nenhuma categoria cadastrada ainda.
                        </p>
                    </Card>
                )}
            </ScrollArea>

            {/* 🔹 Modal de criação/edição */}
            <CategoryActionDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                currentCategory={editingCategory || undefined}
            />

            {selectedCategory && (
                <CategoryDeleteDialog
                    open={openDelete}
                    onOpenChange={setOpenDelete}
                    category={selectedCategory}
                />
            )}
        </div>
    )
}

// 
/**
 * Formata uma data ISO (ex: "2025-10-24T04:44:22.177884Z")
 * para o padrão brasileiro dd/MM/yyyy.
 * Retorna "—" se for inválida.
 */
export function formatDateBRSafe(dateString?: string | Date): string {
    if (!dateString) return "—"

    try {
        const date = typeof dateString === "string" ? new Date(dateString) : dateString
        if (isNaN(date.getTime())) return "—"

        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    } catch {
        return "—"
    }
}