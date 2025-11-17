import { Flex, Spinner, Container, Text } from "@chakra-ui/react";

export function DashboardLoading() {
  return (
    <Container maxW="6xl" py={16} px={{ base: 4, md: 6 }}>
      <Flex justify="center" align="center" minH="240px" gap={3}>
        <Spinner color="blue.500" />
        <Text color="fg.muted">Carregando informações do estoque...</Text>
      </Flex>
    </Container>
  )
}