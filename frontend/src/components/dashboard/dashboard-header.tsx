import { Flex, Stack, Button, Text, Heading } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function DashboardHeader() {
  const navigate = useNavigate()

  return (
    <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={6}>
      <Stack gap={2}>
        <Heading size="lg">Visao geral</Heading>
        <Text color="fg.muted">
          Acompanhe as principais metricas do seu estoque e gerencie seus produtos de forma eficiente.
        </Text>
      </Stack>

      <Button
        colorPalette="blue"
        alignSelf={{ base: "flex-start", md: "center" }}
        display="inline-flex"
        gap={2}
        onClick={() => navigate({ to: "/products" })}
      >
        Visualizar produtos
        <ArrowRight size={18} />
      </Button>
    </Flex>
  )
}