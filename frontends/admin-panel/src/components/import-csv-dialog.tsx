"use client"

import { useState } from "react"
import { importService } from "@/services/import"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Tag } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { useCategoryContext } from "@/context/category-provider"
import { SelectFilter } from "@/features/transactions/select-filter"
import { normalizeHexColor } from "@/lib/colorUtils"

export function ImportCSVDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [importing, setImporting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const { user } = useUser()
  const { categories } = useCategoryContext()

  // 🔹 Opções de categorias para o select
  const categoryItems = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
    color: normalizeHexColor(cat.color),
    icon: <Tag className="h-4 w-4" style={{ color: cat.color }} />,
  }))

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setMessage("")
    setProgress(0)
    setPreviewData([])

    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p))
    }, 150)

    try {
      const data = await importService.previewCSV(file)
      setProgress(100)
      setPreviewData(data.rows || [])
      setMessage(`${data.message} (${data.total} linhas detectadas)`)
    } catch (err: any) {
      setMessage("Erro ao processar CSV: " + err.message)
    } finally {
      clearInterval(timer)
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewData([])
    setMessage("")
    setProgress(0)
    setSelectedCategory([])
  }

  const handleImportToDB = async () => {
    if (!previewData.length || !selectedCategory[0]) {
      setMessage("⚠️ Selecione uma categoria antes de importar.")
      return
    }

    setImporting(true)
    setMessage("Enviando dados para o banco...")

    try {
      const result = await importService.saveBatch(
        previewData,
        user,
        selectedCategory[0] // envia apenas uma categoria
      )
      setMessage(`✅ ${result.message}`)
    } catch (err: any) {
      setMessage("Erro ao enviar para o banco: " + err.message)
    } finally {
      setImporting(false)
    }
  }

  const isProcessed = previewData.length > 0 && !loading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-4xl
          rounded-xl border border-border
          bg-background shadow-xl
          p-6 flex flex-col
        "
      >
        <DialogHeader>
          <DialogTitle>Importar transações</DialogTitle>
          <DialogDescription>
            Envie um arquivo <strong>.csv</strong> com suas transações financeiras.
          </DialogDescription>
        </DialogHeader>

        {/* Área de upload */}
        {!isProcessed && (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed 
            border-muted-foreground/30 bg-muted/10 px-6 py-14 text-center transition hover:bg-muted/20"
            onClick={() => document.getElementById("csvInput")?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-base font-medium text-foreground">
              Arraste e solte seu arquivo CSV aqui
            </p>
            <p className="text-sm text-muted-foreground">
              ou clique para selecionar um arquivo .csv
            </p>
            <input
              id="csvInput"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {file && (
              <p className="text-sm text-primary font-medium mt-2">
                {file.name}
              </p>
            )}
          </div>
        )}

        {/* Barra de progresso */}
        {loading && (
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Importando arquivo...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Mensagem */}
        {message && (
          <p
            className={`text-sm mt-3 ${
              message.toLowerCase().includes("erro")
                ? "text-red-600 dark:text-red-400"
                : message.startsWith("⚠️")
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Preview */}
        {isProcessed && (
          <>
            {/* Select de categoria */}
            <div className="mt-4 mb-2">
              <SelectFilter
                label="Categoria"
                items={categoryItems}
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                Pré-visualização ({previewData.length} linhas)
              </h4>

              <div className="relative rounded-md border overflow-y-auto max-h-[50vh]">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0 z-10">
                    <tr>
                      {previewData[0]?.map((header, i) => (
                        <th
                          key={i}
                          className="p-2 text-left font-semibold text-muted-foreground border-b"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="p-2 text-sm truncate">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-background to-transparent" />
              </div>
            </div>
          </>
        )}

        {/* Ações */}
        <div className="pt-4 flex justify-end gap-2">
          {isProcessed ? (
            <>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={importing}
                className="w-full sm:w-auto"
              >
                Voltar
              </Button>
              <Button
                onClick={handleImportToDB}
                disabled={importing || !selectedCategory[0]}
                className="w-full sm:w-auto"
              >
                {importing ? "Enviando..." : "Importar para o banco"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Processando..." : "Visualizar CSV"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
