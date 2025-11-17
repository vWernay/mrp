import { ArrowLeft, Plus } from "lucide-react"
import { Button, Flex, HStack, Stack, Text } from "@chakra-ui/react"

interface ProductsHeaderProps {
  canGoBack: boolean
  onBack: () => void
  onCreate: () => void
}

export function ProductsHeader({ canGoBack, onBack, onCreate }: ProductsHeaderProps) {
  return (
    <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4}>
      <Stack gap={2}>
        <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase">
          Catálogo
        </Text>
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          Produtos
        </Text>
        <Text color="fg.muted">Lista de produtos cadastrados no sistema.</Text>
      </Stack>

      <HStack>
        {canGoBack && (
          <Button type="button" onClick={onBack}>
            <ArrowLeft />
            Voltar
          </Button>
        )}
        <Button
          colorPalette="blue"
          display="inline-flex"
          gap={2}
          alignSelf={{ base: "stretch", md: "center" }}
          onClick={onCreate}
        >
          <Plus size={18} />
          Novo produto
        </Button>
      </HStack>
    </Flex>
  )
}
