import { Container, SimpleGrid, Stack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { CategoryDistributionPanel } from "@/components/dashboard/category-distribution-panel"
import { DashboardError } from "@/components/dashboard/dashboard-error"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"
import { LowStockPanel } from "@/components/dashboard/low-stock-panel"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { InventoryEvolutionPanel } from "@/components/dashboard/inventory-evolution-panel"
import { getItems } from "@/lib/api"

export const Route = createFileRoute("/")({
  component: DashboardRoute,
})

function DashboardRoute() {
  const {
    data: items = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    retry: 3,
  })

  if (isPending) {
    return <DashboardLoading />
  }

  if (isError) {
    return <DashboardError error={error} onRetry={() => refetch()} />
  }

  return (
    <Container maxW="6xl" px={{ base: 4, md: 6 }} py={10}>
      <Stack gap={10}>
        <DashboardHeader />

        <MetricsGrid items={items} />

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <LowStockPanel items={items} />
          <CategoryDistributionPanel items={items} />
        </SimpleGrid>

        <InventoryEvolutionPanel />
      </Stack>
    </Container>
  )
}
