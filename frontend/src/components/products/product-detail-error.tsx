import { Button, Container, Stack, Text } from "@chakra-ui/react"

interface ProductDetailErrorProps {
  message?: string
  onRetry: () => void
  onBackToList: () => void
}

export function ProductDetailError({
  message,
  onRetry,
  onBackToList,
}: ProductDetailErrorProps) {
  return (
    <Container maxW="3xl" px={{ base: 4, md: 6 }} py={10}>
      <Stack align="center" gap={4} textAlign="center">
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          Produto não encontrado
        </Text>
        <Text color="fg.muted">
          {message ?? "O item solicitado não está disponível."}
        </Text>
        <Button colorPalette="blue" onClick={onRetry}>
          Tentar novamente
        </Button>
        <Button onClick={onBackToList} variant="ghost">
          Voltar para produtos
        </Button>
      </Stack>
    </Container>
  )
}
