import {
  Box,
  EmptyState,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { LuPackage } from "react-icons/lu"
import type { Item } from "@/lib/api"

interface LowStockPanelProps {
  items: Item[]
}

const LOW_STOCK_THRESHOLD = 5

export function LowStockPanel({ items }: LowStockPanelProps) {
  const lowStockProducts = items.filter((item) => item.lowStock)

  return (
    <Box bg="bg.panel" borderRadius="lg" borderWidth="1px" p={6}>
      <Heading size="md">Estoque baixo</Heading>
      <Text color="fg.muted" mt={2}>
        Produtos com quantidade menor que {LOW_STOCK_THRESHOLD} irão aparecer
        aqui.
      </Text>
      <Stack gap={3} mt={6}>
        {lowStockProducts.length === 0 ? (
          <Flex align="center" h="full" justify="center" py={10} w="full">
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <LuPackage />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>
                    Nenhum produto com estoque baixo
                  </EmptyState.Title>
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
            <Flex
              align="center"
              borderRadius="md"
              borderWidth="1px"
              justify="space-between"
              key={product.id}
              px={4}
              py={3}
            >
              <Stack gap={0}>
                <Text fontWeight="medium">{product.name}</Text>
                <Text color="fg.muted" fontSize="sm">
                  Categoria: {product.category}
                </Text>
              </Stack>
              <Box
                bg="orange.500"
                borderRadius="full"
                color="white"
                fontSize="sm"
                fontWeight="semibold"
                px={3}
                py={1}
              >
                Qtd: {product.quantity.toLocaleString("pt-BR")}
              </Box>
            </Flex>
          ))
        )}
      </Stack>
    </Box>
  )
}
