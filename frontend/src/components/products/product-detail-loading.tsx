import { Container, Flex, Spinner, Text } from "@chakra-ui/react"

export function ProductDetailLoading() {
  return (
    <Container maxW="4xl" py={16} px={{ base: 4, md: 6 }}>
      <Flex justify="center" align="center" minH="240px" gap={3}>
        <Spinner color="blue.500" />
        <Text color="fg.muted">Carregando produto...</Text>
      </Flex>
    </Container>
  )
}
