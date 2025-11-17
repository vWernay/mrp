import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react"

interface ProductsErrorProps {
  error: Error | null
  onRetry: () => void
}

export function ProductsError({ error, onRetry }: ProductsErrorProps) {
  return (
    <Container maxW="4xl" py={16} px={{ base: 4, md: 6 }}>
      <Stack gap={4} align="center" textAlign="center">
        <Heading size="md">Não foi possível carregar os produtos</Heading>
        <Text color="fg.muted">{error instanceof Error ? error.message : "Tente novamente."}</Text>
        <Button colorPalette="blue" onClick={onRetry}>
          Recarregar
        </Button>
      </Stack>
    </Container>
  )
}
