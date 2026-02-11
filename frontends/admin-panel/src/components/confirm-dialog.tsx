import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { ReactNode, JSX } from "react"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  desc: JSX.Element | string
  handleConfirm: () => void
  disabled?: boolean
  cancelBtnText?: string
  confirmText?: ReactNode
  destructive?: boolean
  isLoading?: boolean
  className?: string
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  desc,
  children,
  className,
  confirmText = "Confirmar",
  cancelBtnText = "Cancelar",
  destructive = false,
  isLoading = false,
  disabled = false,
  handleConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          "sm:max-w-[500px] bg-background border border-border/60 shadow-xl",
          className
        )}
      >
        <AlertDialogHeader className="text-start space-y-2">
          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-muted-foreground text-sm">{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Extra content (ex: input, alert, etc) */}
        {children && <div className="mt-4">{children}</div>}

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel disabled={isLoading}>
            {cancelBtnText}
          </AlertDialogCancel>

          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
          >
            {isLoading ? "Carregando..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
