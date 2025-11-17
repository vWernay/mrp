import { Box, FormatNumber, LocaleProvider, Text } from "@chakra-ui/react"

type MetricCardProps = {
  label: string
  value: string | number
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Box bg="bg.panel" borderRadius="lg" borderWidth="1px" p={6}>
      <Text color="fg.muted" fontSize="sm">
        {label}
      </Text>
      <LocaleProvider locale="pt-BR">
        <Text fontSize="2xl" fontWeight="semibold" mt={2}>
          {typeof value === "number" ? (
            <FormatNumber style="decimal" value={value} />
          ) : (
            value
          )}
        </Text>
      </LocaleProvider>
    </Box>
  )
}
