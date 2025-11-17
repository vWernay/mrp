import type { Item } from "@/lib/api"
import { Box, Flex, FormatNumber, Heading, LocaleProvider, Stack, Text } from "@chakra-ui/react"

interface TopProductsPanelProps {
  items: Item[]
}

export function TopProductsPanel({ items }: TopProductsPanelProps) {
  const topProducts = [...items]
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5)

  if (topProducts.length === 0) {
    return (
      <Box borderWidth="1px" borderRadius="lg" bg="bg.surface" p={{ base: 6, md: 8 }}>
        <Heading size="md">Top 5 produtos por valor em estoque</Heading>
        <Text color="fg.muted" mt={2}>Nenhum produto cadastrado.</Text>
      </Box>
    )
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" bg="bg.surface" p={{ base: 6, md: 8 }}>
      <Heading size="md">Top 5 produtos por valor em estoque</Heading>
      <Text color="fg.muted" mt={2}>
        Aproximação simples da curva ABC considerando preço multiplicado pela quantidade disponível.
      </Text>

      <Stack mt={6} gap={4}>
        {topProducts.map((p, index) => (
          <Flex key={p.id} justify="space-between" borderWidth="1px" borderRadius="md" px={4} py={3}>
            <Stack gap={0}>
              <Text fontSize="sm" color="fg.muted" fontWeight="semibold">#{index + 1}</Text>
              <Text fontWeight="bold">{p.name}</Text>
              <Text fontSize="sm" color="fg.muted">Categoria: {p.category}</Text>
            </Stack>
            <Stack gap={0} textAlign="right">
              <LocaleProvider locale="pt-BR">
                <Text fontWeight="semibold">
                  <FormatNumber value={p.totalValue} style="currency" currency="BRL" />
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  <FormatNumber value={p.quantity} style="decimal" /> {p.unit} • <FormatNumber value={p.unitPrice} style="currency" currency="BRL" />
                </Text>
              </LocaleProvider>
            </Stack>
          </Flex>
        ))}
      </Stack>
    </Box>
  )
}
