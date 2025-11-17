import {
  Badge,
  Box,
  Flex,
  FormatNumber,
  Heading,
  LocaleProvider,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react"
import type { Item } from "@/lib/api"

type ABCClass = "A" | "B" | "C"

interface ABCPanelProps {
  items: Item[]
  thresholds?: { A: number; B: number }
  showRows?: number
}

type ABCRow = Item & {
  contribution: number // 0..1
  cumulative: number // 0..1
  klass: ABCClass
}

const percentFmt = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const defaultThresholds = { A: 0.8, B: 0.95 }

function classifyABC(
  items: Item[],
  thresholds = defaultThresholds
): { rows: ABCRow[]; summary: Record<ABCClass, { count: number; share: number }> } {
  const totalValue = items.reduce((acc, it) => acc + it.totalValue, 0)
  if (totalValue <= 0) {
    return {
      rows: [],
      summary: { A: { count: 0, share: 0 }, B: { count: 0, share: 0 }, C: { count: 0, share: 0 } },
    }
  }

  const sorted = [...items].sort((a, b) => b.totalValue - a.totalValue)
  let running = 0
  const rows: ABCRow[] = sorted.map((it) => {
    const contrib = it.totalValue / totalValue
    running += contrib
    let klass: ABCClass
    if (running <= thresholds.A) klass = "A"
    else if (running <= thresholds.B) klass = "B"
    else klass = "C"
    return { ...it, contribution: contrib, cumulative: running, klass }
  })

  const sum: Record<ABCClass, { count: number; share: number }> = {
    A: { count: 0, share: 0 },
    B: { count: 0, share: 0 },
    C: { count: 0, share: 0 },
  }
  rows.forEach((r) => {
    sum[r.klass].count += 1
    sum[r.klass].share += r.contribution
  })

  return { rows, summary: sum }
}

export function ABCPanel({ items, thresholds = defaultThresholds, showRows = 15 }: ABCPanelProps) {
  const { rows, summary } = classifyABC(items, thresholds)

  return (
    <Box bg="bg.surface" borderRadius="lg" borderWidth="1px" p={{ base: 6, md: 8 }}>
      <Heading size="md">Curva ABC (valor em estoque)</Heading>
      <Text color="fg.muted" mt={2}>
        Classificação por contribuição acumulada do valor (A até {percentFmt.format(thresholds.A)}, B até {percentFmt.format(thresholds.B)}, restante C).
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={6}>
        <SummaryCard label="Classe A" value={summary.A.count} hint={percentFmt.format(summary.A.share)} color="blue" />
        <SummaryCard label="Classe B" value={summary.B.count} hint={percentFmt.format(summary.B.share)} color="purple" />
        <SummaryCard label="Classe C" value={summary.C.count} hint={percentFmt.format(summary.C.share)} color="gray" />
      </SimpleGrid>

      <Stack mt={6}>
        {rows.length === 0 ? (
          <Text color="fg.muted">Sem dados para classificar.</Text>
        ) : (
          <LocaleProvider locale="pt-BR">
            <Table.Root rounded="lg" size="md" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Produto</Table.ColumnHeader>
                  <Table.ColumnHeader>Categoria</Table.ColumnHeader>
                  <Table.ColumnHeader>Valor</Table.ColumnHeader>
                  <Table.ColumnHeader>% Contrib.</Table.ColumnHeader>
                  <Table.ColumnHeader>% Acum.</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Classe</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.slice(0, showRows).map((r) => (
                  <Table.Row key={r.id}>
                    <Table.Cell>
                      <Stack gap={0.5}>
                        <Text fontWeight="semibold">{r.name}</Text>
                        <Text color="fg.muted" fontSize="xs">ID: {r.id}</Text>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>{r.category}</Table.Cell>
                    <Table.Cell>
                      <FormatNumber currency="BRL" style="currency" value={r.totalValue} />
                    </Table.Cell>
                    <Table.Cell>{percentFmt.format(r.contribution)}</Table.Cell>
                    <Table.Cell>{percentFmt.format(r.cumulative)}</Table.Cell>
                    <Table.Cell textAlign="end">
                      <Badge colorPalette={r.klass === "A" ? "blue" : r.klass === "B" ? "purple" : "gray"} variant="solid">
                        {r.klass}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </LocaleProvider>
        )}
        {rows.length > showRows && (
          <Text color="fg.muted" fontSize="sm">
            Mostrando {showRows} de {rows.length} produtos.
          </Text>
        )}
      </Stack>
    </Box>
  )
}

function SummaryCard({
  label,
  value,
  hint,
  color,
}: {
  label: string
  value: number
  hint: string
  color: "blue" | "purple" | "gray"
}) {
  return (
    <Flex align="center" borderRadius="lg" borderWidth="1px" justify="space-between" p={4}>
      <Stack gap={0}>
        <Text color="fg.muted" fontSize="sm">{label}</Text>
        <Text as="span" fontSize="2xl" fontWeight="bold">{value}</Text>
      </Stack>
      <Badge colorPalette={color} variant="subtle">{hint}</Badge>
    </Flex>
  )
}
