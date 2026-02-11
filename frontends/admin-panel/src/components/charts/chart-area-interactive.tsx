"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

interface ChartAreaInteractiveProps {
  data: { label: string; income: number; expense: number; balance: number }[]
  onChangePeriod?: (period: string) => void
}

const chartConfig = {
  income: { label: "Receitas", color: "#22c55e" },
  expense: { label: "Despesas", color: "#ef4444" },
  balance: { label: "Saldo", color: "#3b82f6" },
} satisfies ChartConfig

export function ChartAreaInteractive({ data, onChangePeriod }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("1y")
  const [visibleLines, setVisibleLines] = React.useState<Record<string, boolean>>({
    income: true,
    expense: true,
    balance: true,
  })

  const handleToggle = (key: string) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (value: string) => {
    setTimeRange(value)
    onChangePeriod?.(value)
  }

  return (
    <Card className="pt-0">
      {/* ===== HEADER ===== */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Evolução Financeira</CardTitle>
          <CardDescription>
            Acompanhe receitas, despesas e saldo ao longo do tempo
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={handleChange}>
          <SelectTrigger
            className="hidden w-[140px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Selecionar período"
          >
            <SelectValue placeholder="Último ano" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1y">Último ano</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="3m">Últimos 3 meses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* ===== TOGGLE LEGEND (DISCRETA) ===== */}
      <div className="flex flex-wrap justify-end gap-3 px-4 pt-3">
        {Object.entries(chartConfig).map(([key, conf]) => (
          <div
            key={key}
            onClick={() => handleToggle(key)}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              visibleLines[key]
                ? "text-foreground/80 hover:bg-muted"
                : "text-muted-foreground/40 hover:text-foreground/70"
            )}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: conf.color,
                opacity: visibleLines[key] ? 1 : 0.2,
              }}
            />
            {conf.label}
          </div>
        ))}
      </div>

      {/* ===== CHART ===== */}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer className="aspect-auto h-[250px] w-full" config={chartConfig}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.income.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.income.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.expense.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.expense.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.balance.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.balance.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => value}
                />
              }
            />

            {visibleLines.income && (
              <Area
                dataKey="income"
                name={chartConfig.income.label}
                type="monotone"
                fill="url(#fillIncome)"
                stroke={chartConfig.income.color}
                strokeWidth={2}
              />
            )}
            {visibleLines.expense && (
              <Area
                dataKey="expense"
                name={chartConfig.expense.label}
                type="monotone"
                fill="url(#fillExpense)"
                stroke={chartConfig.expense.color}
                strokeWidth={2}
              />
            )}
            {visibleLines.balance && (
              <Area
                dataKey="balance"
                name={chartConfig.balance.label}
                type="monotone"
                fill="url(#fillBalance)"
                stroke={chartConfig.balance.color}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
