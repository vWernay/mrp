import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  FormatNumber,
  IconButton,
  LocaleProvider,
  Pagination,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Eye, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import type { Item } from "@/lib/api"

interface ProductsTableProps {
  items: Item[]
  pageSize?: number
  deletingId: number | null
  isDeleting: boolean
  onDelete: (id: number) => void
  onViewDetails: (id: number) => void
}

const DEFAULT_PAGE_SIZE = 10

export function ProductsTable({
  items,
  pageSize = DEFAULT_PAGE_SIZE,
  deletingId,
  isDeleting,
  onDelete,
  onViewDetails,
}: ProductsTableProps) {
  const [page, setPage] = useState(1)
  const count = items.length
  const totalPages = Math.max(1, Math.ceil(Math.max(count, 1) / pageSize))
  const currentPage = Math.min(page, totalPages)

  const visibleItems = useMemo(() => {
    const startRange = (currentPage - 1) * pageSize
    const endRange = startRange + pageSize
    return items.slice(startRange, endRange)
  }, [currentPage, items, pageSize])

  return (
    <>
      <Table.Root interactive rounded="lg" size="lg" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nome</Table.ColumnHeader>
            <Table.ColumnHeader>Categoria</Table.ColumnHeader>
            <Table.ColumnHeader>Preço</Table.ColumnHeader>
            <Table.ColumnHeader>Quantidade</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visibleItems.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5} textAlign="center">
                <Text color="fg.muted">
                  Nenhum produto cadastrado até o momento.
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            visibleItems.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold">{product.name}</Text>
                    <Text color="fg.muted" fontSize="xs">
                      ID: {product.id}
                    </Text>
                  </VStack>
                </Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>
                  <LocaleProvider locale="pt-BR">
                    <FormatNumber
                      currency="BRL"
                      style="currency"
                      value={product.unitPrice}
                    />
                  </LocaleProvider>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap={3} justify="flex-end">
                    <Text>
                      {product.quantity.toLocaleString("pt-BR")} {product.unit}
                    </Text>
                    {product.lowStock && (
                      <Badge colorPalette="orange" variant="solid">
                        Baixo estoque
                      </Badge>
                    )}
                  </Flex>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Flex gap={2} justify="flex-end">
                    <Button
                      display="inline-flex"
                      gap={2}
                      onClick={() => onViewDetails(product.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Eye size={16} />
                      Ver detalhes
                    </Button>
                    <Button
                      colorPalette="red"
                      disabled={deletingId === product.id && isDeleting}
                      display="inline-flex"
                      gap={2}
                      onClick={() => onDelete(product.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 size={16} />
                      {deletingId === product.id && isDeleting
                        ? "Excluindo..."
                        : "Excluir"}
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {count > pageSize && (
        <Pagination.Root
          count={count}
          onPageChange={(event) => setPage(event.page)}
          page={currentPage}
          pageSize={pageSize}
        >
          <ButtonGroup size="sm" variant="ghost" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(paginationPage) => (
                <IconButton
                  key={paginationPage.value}
                  variant={{ base: "ghost", _selected: "outline" }}
                >
                  {paginationPage.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      )}
    </>
  )
}
