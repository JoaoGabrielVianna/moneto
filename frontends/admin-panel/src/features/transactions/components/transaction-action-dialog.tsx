"use client"

import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransactionContext } from "@/context/transactions-provider"
import { useCategoryContext } from "@/context/category-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

//
// ✅ Schema (validação e tipagem consistentes)
//
const formSchema = z.object({
  description: z.string().min(2, "A descrição é obrigatória"),
  amount: z.coerce.number().positive("O valor deve ser positivo"),
  date: z.string().min(1, "A data é obrigatória"),
  type: z.enum(["income", "expense"]),
  category_id: z.string().min(1, "Selecione uma categoria"),
  notes: z.string().optional(),
})

type TransactionForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTransaction?: any
}

//
// ✅ Componente do Dialog
//
export function TransactionActionDialog({ open, onOpenChange, currentTransaction }: Props) {
  const { create, update } = useTransactionContext()
  const { categories } = useCategoryContext()
  const isEdit = !!currentTransaction

  const form = useForm<TransactionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentTransaction ?? {
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category_id: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (currentTransaction) form.reset(currentTransaction)
  }, [currentTransaction, form])

  //
  // ✅ Envio dos dados com o campo correto
  //
  const onSubmit = async (values: TransactionForm) => {
    const payload = {
      ...values,
      amount: String(values.amount), // backend espera string
      date: new Date(values.date).toISOString(),
    }

    if (isEdit && currentTransaction) {
      await update(currentTransaction.id, payload)
    } else {
      await create(payload)
    }

    onOpenChange(false)
  }

  //
  // ✅ JSX organizado
  //
  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os detalhes da transação abaixo."
              : "Preencha os campos para registrar uma nova transação."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="transaction-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Salário, Aluguel..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: pago em dinheiro" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="transaction-form">
            {isEdit ? "Salvar alterações" : "Criar transação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
