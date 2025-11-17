import { Box, Heading, Text } from "@chakra-ui/react"
import { CategoryDistributionBarChart } from "@/components/charts/category-distribution-bar-chart"
import type { Item } from "@/lib/api"

interface ProductsByCategoryPanelProps {
  items: Item[]
}

export function ProductsByCategoryPanel({
  items,
}: ProductsByCategoryPanelProps) {
  const categoryAggregation = items.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.quantity
      return acc
    },
    {}
  )

  const data = Object.entries(categoryAggregation)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <Box
      bg="bg.surface"
      borderRadius="lg"
      borderWidth="1px"
      p={{ base: 6, md: 8 }}
    >
      <Heading size="md">Produtos por categoria</Heading>
      <Text color="fg.muted" mt={2}>
        Quantidade total de itens agrupados pela categoria principal.
      </Text>

      <Box mt={6}>
        <CategoryDistributionBarChart data={data} />
      </Box>
    </Box>
  )
}
