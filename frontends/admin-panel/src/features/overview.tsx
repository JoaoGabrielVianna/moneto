import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, PiggyBank, Wallet } from "lucide-react"
import { useDashboardContext } from "@/context/dahsboard-provider"


function OverviewPage() {
  const { summary, history, loading, error, refreshHistory } = useDashboardContext()

  if (loading && !history) return <p>Carregando dados do dashboard...</p>
  if (error) return <p>Erro: {error}</p>
  if (!summary.length) return <p>Nenhum dado encontrado.</p>

  const latest = summary.at(-1)!

  const cards = [
    {
      label: "Balance",
      value: formatCurrency(latest.balance),
      notes: "Net balance after all expenses",
      icon: Wallet,
    },
    {
      label: "Total Incomes",
      value: formatCurrency(latest.totalIncome),
      notes: "+20.1% from last month",
      icon: ArrowUpRight,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(latest.totalExpense),
      notes: "-12.3% from last month",
      icon: ArrowDownRight,
    },
    {
      label: "Savings Rate",
      value:
        latest.totalIncome > 0
          ? `${((latest.balance / latest.totalIncome) * 100).toFixed(1)}%`
          : "0%",
      notes: "Of total income saved",
      icon: PiggyBank,
    },
  ]

  // ✅ Gera os dados pro gráfico
  const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData =
    history?.labels.map((label, i) => ({
      label,
      income: history.income[i],
      expense: history.expense[i],
      balance: history.balance[i],
    })) || []

  // Ordena os meses em ordem natural
  chartData.sort((a, b) => MONTH_ORDER.indexOf(a.label) - MONTH_ORDER.indexOf(b.label))

  return (
    <>
      <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
        <div className="pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          {chartData.length ? (
            <ChartAreaInteractive
              data={chartData}
              onChangePeriod={(period) => refreshHistory(period)} // ✅ troca o período sem refresh global
            />
          ) : (
            <p>Nenhum dado histórico disponível.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* cards */}
      <div className="flex justify-between gap-4 flex-wrap">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <Card key={i} className="flex-1 min-w-[200px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold leading-none truncate block">
                  {card.value}
                </span>
                <CardDescription>{card.notes}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}

export default OverviewPage



// src/utils/formatters.ts
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
