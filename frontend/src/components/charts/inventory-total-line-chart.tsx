import { Chart, useChart } from "@chakra-ui/charts"
import { Text } from "@chakra-ui/react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

export type InventoryTotalPoint = {
  timestamp: string
  totalValue: number
}

interface InventoryTotalLineChartProps {
  data: InventoryTotalPoint[]
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function InventoryTotalLineChart({
  data,
}: InventoryTotalLineChartProps) {
  if (!data || data.length === 0) {
    return <Text color="fg.muted">Sem dados suficientes para o período.</Text>
  }

  const chart = useChart({
    data: data.map((p) => ({
      time: p.timestamp,
      total: p.totalValue,
    })),
    series: [{ name: "total", label: "Valor Total", color: "blue.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart} paddingLeft={12}>
      <LineChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={chart.key("time")}
          tickFormatter={(v) =>
            new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit"
            }).format(new Date(v))
          }
          stroke={chart.color("border")}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          stroke={chart.color("border")}
          tickFormatter={(value) => currencyFormatter.format(value)}
        />
        <Tooltip
          animationDuration={120}
          cursor={false}
          content={<Chart.Tooltip formatter={(value) => currencyFormatter.format(value)} />}
        />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </Chart.Root>
  )
}
