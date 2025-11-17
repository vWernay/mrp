import { ReportsContent } from "@/components/reports/reports-content"
import { ReportsError } from "@/components/reports/reports-error"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsLoading } from "@/components/reports/reports-loading"
import { getItems } from "@/lib/api"
import {
  Container,
  Stack
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/reports")({
  component: ReportsRoute,
})

function ReportsRoute() {
  const {
    data: items = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  })

  if (isPending) return <ReportsLoading />

  if (isError) return <ReportsError error={error} onRetry={refetch} />

  return (
    <Container maxW="6xl" py={10} px={{ base: 4, md: 6 }}>
      <Stack gap={10}>
        <ReportsHeader />

        <ReportsContent items={items} />
      </Stack>
    </Container>
  )
}
