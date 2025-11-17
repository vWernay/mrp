import { ArrowLeft, Trash2 } from "lucide-react"
import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react"
import InfoBlock from "@/components/info-block"
import type { Item } from "@/lib/api"

interface ProductDetailContentProps {
  product: Item
  onBack: () => void
  onDelete: () => void
  onRequestStockMovement: () => void
  isDeleting: boolean
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function ProductDetailContent({
  product,
  onBack,
  onDelete,
  onRequestStockMovement,
  isDeleting,
}: ProductDetailContentProps) {
  const totalValue = product.unitPrice * product.quantity

  return (
    <Container maxW="4xl" py={10} px={{ base: 4, md: 6 }}>
      <Stack gap={8}>
        <Button
          variant="ghost"
          alignSelf="flex-start"
          display="inline-flex"
          gap={2}
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <Stack gap={3}>
          <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" color="fg.muted">
            Produto #{product.id}
          </Text>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            {product.name}
          </Text>
          <Text color="fg.muted">Categoria: {product.category}</Text>
        </Stack>

        <Box borderWidth="1px" borderRadius="lg" bg="bg.surface" p={{ base: 6, md: 8 }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            <InfoBlock label="Preço de venda" value={currencyFormatter.format(product.unitPrice)} />
            <InfoBlock
              label="Quantidade em estoque"
              value={`${product.quantity.toLocaleString("pt-BR")} ${product.unit}`}
              extra={
                product.lowStock ? (
                  <Box
                    mt={2}
                    as="span"
                    display="inline-block"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    bg="orange.500"
                    color="white"
                  >
                    Baixo estoque
                  </Box>
                ) : null
              }
            />
            <InfoBlock label="Valor total estimado" value={currencyFormatter.format(totalValue)} />
            <InfoBlock label="Categoria" value={product.category} />
          </SimpleGrid>
        </Box>

        <Flex direction={{ base: "column", md: "row" }} gap={3} justify="flex-end">
          <Button variant="outline" onClick={onRequestStockMovement}>
            Movimentar estoque
          </Button>
          <Button
            colorPalette="red"
            display="inline-flex"
            gap={2}
            onClick={onDelete}
            loading={isDeleting}
            loadingText="Excluindo..."
          >
            <Trash2 size={18} />
            Excluir produto
          </Button>
        </Flex>
      </Stack>
    </Container>
  )
}
