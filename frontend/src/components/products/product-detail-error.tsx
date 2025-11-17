import { Button, Container, Stack, Text } from "@chakra-ui/react"

interface ProductDetailErrorProps {
  message?: string
  onRetry: () => void
  onBackToList: () => void
}

export function ProductDetailError({ message, onRetry, onBackToList }: ProductDetailErrorProps) {
  return (
    <Container maxW="3xl" py={10} px={{ base: 4, md: 6 }}>
      <Stack gap={4} align="center" textAlign="center">
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          Produto não encontrado
        </Text>
        <Text color="fg.muted">{message ?? "O item solicitado não está disponível."}</Text>
        <Button colorPalette="blue" onClick={onRetry}>
          Tentar novamente
        </Button>
        <Button variant="ghost" onClick={onBackToList}>
          Voltar para produtos
        </Button>
      </Stack>
    </Container>
  )
}
