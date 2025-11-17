import { SimpleGrid } from "@chakra-ui/react"
import type { Item } from "@/lib/api"
import { CostByCategoryPanel } from "./cost-by-category-panel"
import { ProductsByCategoryPanel } from "./products-by-category-panel"
import { TopProductsPanel } from "./top-products-panel"
import { ABCPanel } from "./abc-panel"

interface ReportsContentProps {
  items: Item[]
}

export function ReportsContent({ items }: ReportsContentProps) {
  return (
    <>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <ProductsByCategoryPanel items={items} />
        <CostByCategoryPanel items={items} />
      </SimpleGrid>

      <TopProductsPanel items={items} />

      <ABCPanel items={items} />
    </>
  )
}
