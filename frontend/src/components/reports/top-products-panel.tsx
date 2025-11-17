import {
  Box,
  Flex,
  FormatNumber,
  Heading,
  LocaleProvider,
  Stack,
  Text,
} from "@chakra-ui/react"
import type { Item } from "@/lib/api"

interface TopProductsPanelProps {
  items: Item[]
}

export function TopProductsPanel({ items }: TopProductsPanelProps) {
  const topProducts = [...items]
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5)

  if (topProducts.length === 0) {
    return (
      <Box
        bg="bg.surface"
        borderRadius="lg"
        borderWidth="1px"
        p={{ base: 6, md: 8 }}
      >
        <Heading size="md">Top 5 produtos por valor em estoque</Heading>
        <Text color="fg.muted" mt={2}>
          Nenhum produto cadastrado.
        </Text>
      </Box>
    )
  }

  return (
    <Box
      bg="bg.surface"
      borderRadius="lg"
      borderWidth="1px"
      p={{ base: 6, md: 8 }}
    >
      <Heading size="md">Top 5 produtos por valor em estoque</Heading>
      <Text color="fg.muted" mt={2}>
        Aproximação simples da curva ABC considerando preço multiplicado pela
        quantidade disponível.
      </Text>

      <Stack gap={4} mt={6}>
        {topProducts.map((p, index) => (
          <Flex
            borderRadius="md"
            borderWidth="1px"
            justify="space-between"
            key={p.id}
            px={4}
            py={3}
          >
            <Stack gap={0}>
              <Text color="fg.muted" fontSize="sm" fontWeight="semibold">
                #{index + 1}
              </Text>
              <Text fontWeight="bold">{p.name}</Text>
              <Text color="fg.muted" fontSize="sm">
                Categoria: {p.category}
              </Text>
            </Stack>
            <Stack gap={0} textAlign="right">
              <LocaleProvider locale="pt-BR">
                <Text fontWeight="semibold">
                  <FormatNumber
                    currency="BRL"
                    style="currency"
                    value={p.totalValue}
                  />
                </Text>
                <Text color="fg.muted" fontSize="xs">
                  <FormatNumber style="decimal" value={p.quantity} /> {p.unit} •{" "}
                  <FormatNumber
                    currency="BRL"
                    style="currency"
                    value={p.unitPrice}
                  />
                </Text>
              </LocaleProvider>
            </Stack>
          </Flex>
        ))}
      </Stack>
    </Box>
  )
}
