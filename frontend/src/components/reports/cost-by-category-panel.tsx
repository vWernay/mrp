import { CostByCategoryPieChart } from "@/components/charts/cost-by-category-pie-chart"
import type { Item } from "@/lib/api"
import { Box, Heading, Text } from "@chakra-ui/react"

interface CostByCategoryPanelProps {
  items: Item[]
}

export function CostByCategoryPanel({ items }: CostByCategoryPanelProps) {
  const categoryAggregation = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.totalValue
    return acc
  }, {})

  const data = Object.entries(categoryAggregation)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <Box borderWidth="1px" borderRadius="lg" bg="bg.surface" p={{ base: 6, md: 8 }}>
      <Heading size="md">Custo total por categoria</Heading>
      <Text color="fg.muted" mt={2}>
        Valor estimado (preço x quantidade) distribuído no formato pizza.
      </Text>

      <CostByCategoryPieChart data={data} />
    </Box>
  )
}
