import { Container, Stack } from "@chakra-ui/react"
import type { Item } from "@/lib/api"
import { ProductsHeader } from "./products-header"
import { ProductsTable } from "./products-table"

interface ProductsListContentProps {
  items: Item[]
  canGoBack: boolean
  onBack: () => void
  onCreate: () => void
  onViewDetails: (id: number) => void
  onDelete: (id: number) => void
  deletingId: number | null
  isDeleting: boolean
  pageSize?: number
}

export function ProductsListContent({
  items,
  canGoBack,
  onBack,
  onCreate,
  onViewDetails,
  onDelete,
  deletingId,
  isDeleting,
  pageSize,
}: ProductsListContentProps) {
  return (
    <Container maxW="6xl" px={{ base: 4, md: 6 }} py={10}>
      <Stack gap={8}>
        <ProductsHeader
          canGoBack={canGoBack}
          onBack={onBack}
          onCreate={onCreate}
        />
        <ProductsTable
          deletingId={deletingId}
          isDeleting={isDeleting}
          items={items}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          pageSize={pageSize}
        />
      </Stack>
    </Container>
  )
}
