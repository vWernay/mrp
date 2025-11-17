import { Stack, Button, Container, Heading, Text } from "@chakra-ui/react"

interface ReportsErrorProps {
  error: Error
  onRetry: () => void
}

export function ReportsError({ error, onRetry }: ReportsErrorProps) {
  return (
    <Container maxW="4xl" py={16} px={{ base: 4, md: 6 }}>
      <Stack gap={4} align="center" textAlign="center">
        <Heading size="md">Não foi possível carregar os relatórios</Heading>
        <Text color="fg.muted">{error instanceof Error ? error.message : "Tente novamente."}</Text>
        <Button colorPalette="blue" onClick={onRetry}>
          Recarregar
        </Button>
      </Stack>
    </Container>
  )
}