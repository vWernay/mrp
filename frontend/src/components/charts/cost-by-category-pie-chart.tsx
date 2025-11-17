import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export type CostByCategoryDatum = {
  label: string
  value: number
}

interface CostByCategoryPieChartProps {
  data: CostByCategoryDatum[]
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
]
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function CostByCategoryPieChart({ data }: CostByCategoryPieChartProps) {
  const nonZeroValues = data.filter((item) => item.value > 0)

  if (nonZeroValues.length === 0) {
    return (
      <Text color="fg.muted" mt={6}>
        Nenhum valor registrado.
      </Text>
    )
  }

  return (
    <Stack align="center" gap={6} mt={6}>
      <Box height="260px" width="260px">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 12 }}
              formatter={(value: number) => currencyFormatter.format(value)}
            />
            <Pie
              data={nonZeroValues}
              dataKey="value"
              innerRadius={70}
              nameKey="label"
              outerRadius={120}
              paddingAngle={2}
              stroke="none"
            >
              {nonZeroValues.map((entry, index) => (
                <Cell fill={COLORS[index % COLORS.length]} key={entry.label} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack gap={3} width="100%">
        {nonZeroValues.map((entry, index) => (
          <Flex
            align="center"
            gap={4}
            justify="space-between"
            key={entry.label}
          >
            <Flex align="center" gap={3}>
              <Box
                bg={COLORS[index % COLORS.length]}
                borderRadius="full"
                height="12px"
                width="12px"
              />
              <Text fontWeight="medium">{entry.label}</Text>
            </Flex>
            <Text color="fg.muted" fontSize="sm">
              {currencyFormatter.format(entry.value)}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  )
}
