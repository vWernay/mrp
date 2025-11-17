import type { Item } from "@/lib/api"
import { Stack, Flex, Box, Heading, Text, EmptyState, VStack } from "@chakra-ui/react"
import { LuPackage } from "react-icons/lu"

interface LowStockPanelProps {
  items: Item[]
}

const LOW_STOCK_THRESHOLD = 5

export function LowStockPanel({ items }: LowStockPanelProps) {
  const lowStockProducts = items.filter((item) => item.lowStock)

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="bg.panel">
      <Heading size="md">Estoque baixo</Heading>
      <Text color="fg.muted" mt={2}>
        Produtos com quantidade menor que {LOW_STOCK_THRESHOLD} irão aparecer aqui.
      </Text>
      <Stack gap={3} mt={6}>
        {lowStockProducts.length === 0 ? (
          <Flex w="full" h="full" align="center" justify="center" py={10}>
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <LuPackage />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>Nenhum produto com estoque baixo</EmptyState.Title>
                  <EmptyState.Description>
                    {items.length === 0
                      ? "Nenhum produto cadastrado no sistema."
                      : "Que bom! Todos os produtos possuem quantidade suficiente em estoque."}
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          </Flex>
        ) : (
          lowStockProducts.map((product) => (
            <Flex key={product.id} justify="space-between" align="center" borderWidth="1px" borderRadius="md" px={4} py={3}>
              <Stack gap={0}>
                <Text fontWeight="medium">{product.name}</Text>
                <Text color="fg.muted" fontSize="sm">
                  Categoria: {product.category}
                </Text>
              </Stack>
              <Box px={3} py={1} borderRadius="full" bg="orange.500" color="white" fontSize="sm" fontWeight="semibold">
                Qtd: {product.quantity.toLocaleString("pt-BR")}
              </Box>
            </Flex>
          ))
        )}
      </Stack>
    </Box>
  )
}