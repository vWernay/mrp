import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export type CostByCategoryDatum = {
  label: string
  value: number
}

interface CostByCategoryPieChartProps {
  data: CostByCategoryDatum[]
}

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ec4899", "#0ea5e9"]
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function CostByCategoryPieChart({ data }: CostByCategoryPieChartProps) {
  const nonZeroValues = data.filter((item) => item.value > 0)

  if (nonZeroValues.length === 0) {
    return <Text color="fg.muted" mt={6}>Nenhum valor registrado.</Text>
  }

  return (
    <Stack gap={6} mt={6} align="center">
      <Box width="260px" height="260px">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: number) => currencyFormatter.format(value)}
              contentStyle={{ borderRadius: 12 }}
            />
            <Pie
              data={nonZeroValues}
              dataKey="value"
              nameKey="label"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              stroke="none"
            >
              {nonZeroValues.map((entry, index) => (
                <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack gap={3} width="100%">
        {nonZeroValues.map((entry, index) => (
          <Flex key={entry.label} align="center" justify="space-between" gap={4}>
            <Flex align="center" gap={3}>
              <Box width="12px" height="12px" borderRadius="full" bg={COLORS[index % COLORS.length]} />
              <Text fontWeight="medium">{entry.label}</Text>
            </Flex>
            <Text fontSize="sm" color="fg.muted">
              {currencyFormatter.format(entry.value)}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  )
}
