import { Box, FormatNumber, LocaleProvider, Text } from "@chakra-ui/react"

type MetricCardProps = {
  label: string
  value: string | number
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="bg.panel">
      <Text fontSize="sm" color="fg.muted">
        {label}
      </Text>
      <LocaleProvider locale="pt-BR">
        <Text fontSize="2xl" fontWeight="semibold" mt={2}>
          {typeof value === "number" ? (<FormatNumber value={value} style="decimal" />) : value}
        </Text>
      </LocaleProvider>
    </Box>
  )
}