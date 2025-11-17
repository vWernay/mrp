import { Container, Flex, Spinner, Text } from "@chakra-ui/react"

export function DashboardLoading() {
  return (
    <Container maxW="6xl" px={{ base: 4, md: 6 }} py={16}>
      <Flex align="center" gap={3} justify="center" minH="240px">
        <Spinner color="blue.500" />
        <Text color="fg.muted">Carregando informações do estoque...</Text>
      </Flex>
    </Container>
  )
}
