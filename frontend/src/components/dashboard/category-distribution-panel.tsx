import type { Item } from "@/lib/api"
import { CategoryDistributionBarChart } from "@/components/charts/category-distribution-bar-chart"
import { Box, Heading, Text } from "@chakra-ui/react"

interface CategoryDistributionPanelProps {
  items: Item[]
}

export function CategoryDistributionPanel({ items }: CategoryDistributionPanelProps) {
  const categoryTotals = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.quantity
    return acc
  }, {})

  const barChartData = Object.entries(categoryTotals)
    .map(([category, value]) => ({ label: category, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="bg.panel">
      <Heading size="md">Distribuicao por categoria</Heading>
      <Text color="fg.muted" mt={2}>
        Quantidade total de itens em cada categoria
      </Text>
      <Box mt={6}>
        <CategoryDistributionBarChart data={barChartData} />
      </Box>
    </Box>
  )
}