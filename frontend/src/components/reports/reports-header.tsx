import { Stack, Heading, Text } from "@chakra-ui/react";

export function ReportsHeader() {
  return (
    <Stack gap={2}>
      <Heading size="lg">Relatorios gerenciais</Heading>
      <Text color="fg.muted">
        Visao consolidada de categorias e valores utilizando dados de exemplo.
      </Text>
    </Stack>
  )
}