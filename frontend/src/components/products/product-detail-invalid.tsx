import { Button, Container, Stack, Text } from "@chakra-ui/react"

interface ProductDetailInvalidProps {
  onBackToList: () => void
}

export function ProductDetailInvalid({
  onBackToList,
}: ProductDetailInvalidProps) {
  return (
    <Container maxW="3xl" px={{ base: 4, md: 6 }} py={10}>
      <Stack align="center" gap={4} textAlign="center">
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          Produto inválido
        </Text>
        <Text color="fg.muted">O identificador informado não é válido.</Text>
        <Button colorPalette="blue" onClick={onBackToList}>
          Voltar para produtos
        </Button>
      </Stack>
    </Container>
  )
}
