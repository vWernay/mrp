import { Button, Flex, HStack, Stack, Text } from "@chakra-ui/react"
import { ArrowLeft, Plus } from "lucide-react"

interface ProductsHeaderProps {
  canGoBack: boolean
  onBack: () => void
  onCreate: () => void
}

export function ProductsHeader({
  canGoBack,
  onBack,
  onCreate,
}: ProductsHeaderProps) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={4}
      justify="space-between"
    >
      <Stack gap={2}>
        <Text
          color="fg.muted"
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
        >
          Catálogo
        </Text>
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          Produtos
        </Text>
        <Text color="fg.muted">Lista de produtos cadastrados no sistema.</Text>
      </Stack>

      <HStack>
        {canGoBack && (
          <Button onClick={onBack} type="button">
            <ArrowLeft />
            Voltar
          </Button>
        )}
        <Button
          alignSelf={{ base: "stretch", md: "center" }}
          colorPalette="blue"
          display="inline-flex"
          gap={2}
          onClick={onCreate}
        >
          <Plus size={18} />
          Novo produto
        </Button>
      </HStack>
    </Flex>
  )
}
