import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn, Loader2, LayoutDashboard } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import dashboardDark from "@/assets/dashboard-dark.png"
import { useAlert } from "@/context/alert-provider"
import { useUser } from "@/hooks/use-user"

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { showAlert } = useAlert()

  const {login} = useUser();
  const form = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  })
  async function onSubmit(data: LoginFormData) {
    if (!data.email || !data.password) {
      showAlert("warning", "Campos obrigatórios", "Preencha todos os campos.")
      return
    }

    setIsLoading(true)
    try {
      const user = await login({ email: data.email, password: data.password })
      showAlert("success", "Login realizado com sucesso!", `Bem-vindo, ${user.name}`)
      navigate("/overview")
    } catch {
      showAlert("error", "Falha no login", "E-mail ou senha inválidos.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna esquerda (formulário) */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
          <div className="mb-4 flex items-center justify-center">
            <LayoutDashboard className="me-2 h-8 w-8" />
            <h1 className="text-xl font-medium">Moneto</h1>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-2">
          <div className="flex flex-col space-y-2 text-start">
            <h2 className="text-lg font-semibold tracking-tight">Entrar</h2>
            <p className="text-muted-foreground text-sm">
              Informe seu e-mail e senha abaixo <br />
              para acessar sua conta.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Entrar
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground px-8 text-center text-sm">
            Ao clicar em entrar, você concorda com nossos{" "}
            <a href="/terms" className="hover:text-primary underline underline-offset-4">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="/privacy" className="hover:text-primary underline underline-offset-4">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>

      {/* Coluna direita (imagem decorativa) */}
      <div
        className={cn(
          "bg-muted relative h-full overflow-hidden max-lg:hidden",
          "[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none"
        )}
      >
        <img
          src={dashboardDark}
          className="hidden dark:block"
          width={1024}
          height={1138}
          alt="Moneto Dashboard Dark"
        />
      </div>
    </div>
  )
}
