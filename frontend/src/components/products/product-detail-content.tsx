import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ArrowLeft, Trash2 } from "lucide-react"
import InfoBlock from "@/components/info-block"
import type { Item } from "@/lib/api"

interface ProductDetailContentProps {
  product: Item
  onBack: () => void
  onDelete: () => void
  isDeleting: boolean
  movementUI?: React.ReactNode
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function ProductDetailContent({
  product,
  onBack,
  onDelete,
  isDeleting,
  movementUI,
}: ProductDetailContentProps) {
  const totalValue = product.unitPrice * product.quantity

  return (
    <Container maxW="4xl" px={{ base: 4, md: 6 }} py={10}>
      <Stack gap={8}>
        <Button
          alignSelf="flex-start"
          display="inline-flex"
          gap={2}
          onClick={onBack}
          variant="ghost"
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <Stack gap={3}>
          <Text
            color="fg.muted"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
          >
            Produto #{product.id}
          </Text>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            {product.name}
          </Text>
          <Text color="fg.muted">Categoria: {product.category}</Text>
        </Stack>

        <Box
          bg="bg.surface"
          borderRadius="lg"
          borderWidth="1px"
          p={{ base: 6, md: 8 }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            <InfoBlock
              label="Preço de venda"
              value={currencyFormatter.format(product.unitPrice)}
            />
            <InfoBlock
              extra={
                product.lowStock ? (
                  <Box
                    as="span"
                    bg="orange.500"
                    borderRadius="full"
                    color="white"
                    display="inline-block"
                    fontSize="xs"
                    fontWeight="bold"
                    mt={2}
                    px={2}
                    py={1}
                  >
                    Baixo estoque
                  </Box>
                ) : null
              }
              label="Quantidade em estoque"
              value={`${product.quantity.toLocaleString("pt-BR")} ${product.unit}`}
            />
            <InfoBlock
              label="Valor total estimado"
              value={currencyFormatter.format(totalValue)}
            />
            <InfoBlock label="Categoria" value={product.category} />
          </SimpleGrid>
        </Box>

        {movementUI && (
          <Box
            bg="bg.surface"
            borderRadius="lg"
            borderWidth="1px"
            p={{ base: 6, md: 8 }}
          >
            <Text as="h2" fontSize="lg" fontWeight="bold" mb={4}>
              Movimentações de estoque
            </Text>
            {movementUI}
          </Box>
        )}

        <Flex direction={{ base: "column", md: "row" }} gap={3} justify="flex-end">
          <Button
            colorPalette="red"
            display="inline-flex"
            gap={2}
            loading={isDeleting}
            loadingText="Excluindo..."
            onClick={onDelete}
          >
            <Trash2 size={18} />
            Excluir produto
          </Button>
        </Flex>
      </Stack>
    </Container>
  )
}
