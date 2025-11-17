import { useMemo, useState } from "react"
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
import type { Item } from "@/lib/api"
import { Eye, Trash2 } from "lucide-react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

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
      <Table.Root size="lg" variant="outline" rounded="lg" interactive>
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
                <Text color="fg.muted">Nenhum produto cadastrado até o momento.</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            visibleItems.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold">{product.name}</Text>
                    <Text fontSize="xs" color="fg.muted">
                      ID: {product.id}
                    </Text>
                  </VStack>
                </Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>
                  <LocaleProvider locale="pt-BR">
                    <FormatNumber value={product.unitPrice} style="currency" currency="BRL" />
                  </LocaleProvider>
                </Table.Cell>
                <Table.Cell>
                  <Flex justify="flex-end" align="center" gap={3}>
                    <Text>
                      {product.quantity.toLocaleString("pt-BR")} {product.unit}
                    </Text>
                    {product.lowStock && (
                      <Badge variant="solid" colorPalette="orange">
                        Baixo estoque
                      </Badge>
                    )}
                  </Flex>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Flex justify="flex-end" gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      display="inline-flex"
                      gap={2}
                      onClick={() => onViewDetails(product.id)}
                    >
                      <Eye size={16} />
                      Ver detalhes
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      display="inline-flex"
                      gap={2}
                      onClick={() => onDelete(product.id)}
                      disabled={deletingId === product.id && isDeleting}
                    >
                      <Trash2 size={16} />
                      {deletingId === product.id && isDeleting ? "Excluindo..." : "Excluir"}
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
          pageSize={pageSize}
          page={currentPage}
          onPageChange={(event) => setPage(event.page)}
        >
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(paginationPage) => (
                <IconButton key={paginationPage.value} variant={{ base: "ghost", _selected: "outline" }}>
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
