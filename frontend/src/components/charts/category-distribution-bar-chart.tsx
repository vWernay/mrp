import { Chart, useChart } from "@chakra-ui/charts"
import { Text } from "@chakra-ui/react"
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts"

export type CategoryDistributionDatum = {
  label: string
  value: number
}

interface CategoryDistributionBarChartProps {
  data: CategoryDistributionDatum[]
}

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  style: "decimal"
})

export function CategoryDistributionBarChart({ data }: CategoryDistributionBarChartProps) {
  if (data.length === 0) {
    return <Text color="fg.muted">Nenhum dado de categoria disponível.</Text>
  }

  const chart = useChart({
    data: data.map((item) => ({
      category: item.label,
      value: item.value,
    })),
    series: [{ name: "value", label: "Quantidade", color: "teal.solid" }],
  })

  return (
    <Chart.Root chart={chart} maxH="sm">
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey={chart.key("category")} />
        <YAxis axisLine={false} tickLine={false} allowDecimals={false} tickFormatter={(value) => numberFormatter.format(value)} />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={120}
          content={<Chart.Tooltip formatter={(value) => numberFormatter.format(value)} />}
        />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
          >
            <LabelList
              dataKey={chart.key(item.name)}
              formatter={(value) => numberFormatter.format(Number(value))}
              position="top"
              style={{ fontWeight: 600, fill: chart.color("fg") }}
            />
          </Bar>
        ))}
      </BarChart>
    </Chart.Root>
  )
}
