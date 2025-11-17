import { Container, Flex, Spinner, Text } from "@chakra-ui/react"

export function ProductDetailLoading() {
  return (
    <Container maxW="4xl" px={{ base: 4, md: 6 }} py={16}>
      <Flex align="center" gap={3} justify="center" minH="240px">
        <Spinner color="blue.500" />
        <Text color="fg.muted">Carregando produto...</Text>
      </Flex>
    </Container>
  )
}
