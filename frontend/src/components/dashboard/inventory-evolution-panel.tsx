import { Box, Heading, Stack, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { InventoryTotalLineChart } from "@/components/charts/inventory-total-line-chart"
import { getInventoryTotalSeries } from "@/lib/api"

export function InventoryEvolutionPanel() {
  const { data = [], isPending, isError, refetch } = useQuery({
    queryKey: ["inventory-total-series"],
    queryFn: getInventoryTotalSeries,
    retry: 1,
  })

  return (
    <Box bg="bg.panel" borderRadius="lg" borderWidth="1px" p={{ base: 6, md: 8 }}>
      <Heading size="md">Evolução do valor em estoque</Heading>
      <Text color="fg.muted" mt={2}>
        Série temporal do valor total (preço × quantidade) ao longo do tempo.
      </Text>

      <Stack mt={6}>
        {isPending ? (
          <Text color="fg.muted">Carregando série...</Text>
        ) : isError ? (
          <Text color="red.500" cursor="pointer" onClick={() => refetch()}>
            Não foi possível carregar. Clique para tentar novamente.
          </Text>
        ) : (
          <InventoryTotalLineChart data={data} />
        )}
      </Stack>
    </Box>
  )
}
