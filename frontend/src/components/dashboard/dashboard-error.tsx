import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";

interface DashboardErrorProps {
  error: Error
  onRetry: () => void
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <Container maxW="4xl" py={16} px={{ base: 4, md: 6 }}>
      <Stack gap={4} align="center" textAlign="center">
        <Heading size="md">Não foi possível carregar os dados</Heading>
        <Text color="fg.muted">{error instanceof Error ? error.message : "Tente novamente mais tarde."}</Text>
        <Button colorPalette="blue" onClick={onRetry}>
          Tentar novamente
        </Button>
      </Stack>
    </Container>
  )
}