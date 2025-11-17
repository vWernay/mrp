import { SimpleGrid } from "@chakra-ui/react"
import type { Item } from "@/lib/api"
import { MetricCard } from "./metric-card"

interface MetricsGridProps {
  items: Item[]
}

export function MetricsGrid({ items }: MetricsGridProps) {
  const categoryTotals = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.quantity
    return acc
  }, {})

  const totalSkus = items.length
  const totalUnits = items.reduce((total, item) => total + item.quantity, 0)
  const totalCategories = Object.keys(categoryTotals).length

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
      <MetricCard label="Produtos cadastrados" value={totalSkus} />
      <MetricCard label="Unidades em estoque" value={totalUnits} />
      <MetricCard label="Categorias ativas" value={totalCategories} />
    </SimpleGrid>
  )
}
