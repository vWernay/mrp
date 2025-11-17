import { Badge, Box, Flex, Separator, Stack, Text } from "@chakra-ui/react"
import type { Movement } from "@/lib/api"

interface MovementsListProps {
  movements: Movement[]
  unit: string
  isLoading?: boolean
}

const numberFmt = new Intl.NumberFormat("pt-BR", {
  style: "decimal",
})
const currencyFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})
const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

export function MovementsList({ movements, unit, isLoading }: MovementsListProps) {
  if (isLoading) {
    return <Text color="fg.muted">Carregando movimentações...</Text>
  }

  if (!movements || movements.length === 0) {
    return <Text color="fg.muted">Nenhuma movimentação registrada.</Text>
  }

  return (
    <Stack gap={3}>
      {movements.map((m, idx) => {
        const date = new Date(m.timestamp)
        const isEntry = m.movementType === "entry" || m.movementType === "init"
        return (
          <Box key={m.id}>
            <Flex align="center" justify="space-between">
              <Stack gap={0}>
                <Text fontWeight="semibold">
                  {isEntry ? "Entrada" : "Saída"} • {dateFmt.format(date)}
                </Text>
                <Text color="fg.muted" fontSize="sm">
                  Quantidade: {numberFmt.format(m.quantity)} {unit} • Preço: {currencyFmt.format(m.unitPrice)}
                </Text>
              </Stack>
              <Badge colorPalette={isEntry ? "green" : "red"} variant="subtle">
                {isEntry ? "+" : "-"}
                {numberFmt.format(m.quantity)} {unit}
              </Badge>
            </Flex>
            <Text color="fg.muted" fontSize="xs" mt={1}>
              Após movimento: {numberFmt.format(m.quantityAfter)} {unit}
            </Text>
            {idx < movements.length - 1 && <Separator mt={3} />}
          </Box>
        )
      })}
    </Stack>
  )
}
