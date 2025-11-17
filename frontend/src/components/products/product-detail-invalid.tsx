import { Button, Container, Stack, Text } from "@chakra-ui/react"

interface ProductDetailInvalidProps {
  onBackToList: () => void
}

export function ProductDetailInvalid({ onBackToList }: ProductDetailInvalidProps) {
  return (
    <Container maxW="3xl" py={10} px={{ base: 4, md: 6 }}>
      <Stack gap={4} align="center" textAlign="center">
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
