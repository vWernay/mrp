import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ProductDetailContent } from "@/components/products/product-detail-content"
import { ProductDetailError } from "@/components/products/product-detail-error"
import { ProductDetailInvalid } from "@/components/products/product-detail-invalid"
import { ProductDetailLoading } from "@/components/products/product-detail-loading"
import { toaster } from "@/components/ui/toaster"
import {
  createMovement,
  deleteItem,
  getItem,
  getMovements,
  type CreateMovementInput,
} from "@/lib/api"
import { StockMovementForm } from "@/components/products/stock-movement-form"
import { MovementsList } from "@/components/products/movements-list"
import { HStack, Separator, Text } from "@chakra-ui/react"

export const Route = createFileRoute("/products/$id")({
  component: ProductDetailRoute,
})

function ProductDetailRoute() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const itemId = Number(id)
  const queryClient = useQueryClient()

  const {
    data: product,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItem(itemId),
    enabled: Number.isInteger(itemId) && !Number.isNaN(itemId),
    retry: false,
  })

  const {
    data: movements = [],
    refetch: refetchMovements,
    isPending: isMovementsPending,
  } = useQuery({
    queryKey: ["movements", itemId],
    queryFn: () => getMovements(itemId, 20),
    enabled: Number.isInteger(itemId) && !Number.isNaN(itemId),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      toaster.create({
        title: "Produto removido",
        description: "O item foi excluído com sucesso.",
        type: "success",
        duration: 3500,
        closable: true,
      })
      queryClient.invalidateQueries({ queryKey: ["items"] })
      queryClient.removeQueries({ queryKey: ["item", itemId] })
      navigate({ to: "/products" })
    },
    onError: (mutationError: unknown) => {
      toaster.create({
        title: "Não foi possível remover",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Tente novamente em breve.",
        type: "error",
        duration: 4000,
        closable: true,
      })
    },
  })

  const movementMutation = useMutation({
    mutationFn: (payload: CreateMovementInput) => createMovement(payload),
    onSuccess: () => {
      toaster.create({
        title: "Movimentação registrada",
        description: "O estoque foi atualizado.",
        type: "success",
        duration: 3000,
        closable: true,
      })
      queryClient.invalidateQueries({ queryKey: ["items"] })
      queryClient.invalidateQueries({ queryKey: ["item", itemId] })
      queryClient.invalidateQueries({ queryKey: ["movements", itemId] })
      refetch()
      refetchMovements()
    },
    onError: (mutationError: unknown) => {
      toaster.create({
        title: "Não foi possível movimentar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Tente novamente em instantes.",
        type: "error",
        duration: 4000,
        closable: true,
      })
    },
  })

  if (Number.isNaN(itemId)) {
    return (
      <ProductDetailInvalid
        onBackToList={() => navigate({ to: "/products" })}
      />
    )
  }

  if (isPending) {
    return <ProductDetailLoading />
  }

  if (isError || !product) {
    return (
      <ProductDetailError
        message={error instanceof Error ? error.message : undefined}
        onBackToList={() => navigate({ to: "/products" })}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <ProductDetailContent
      isDeleting={deleteMutation.isPending}
      movementUI={
        product ? (
          <>
            <StockMovementForm
              defaultUnitPrice={product.unitPrice}
              isSubmitting={movementMutation.isPending}
              unit={product.unit}
              onSubmit={(values) =>
                movementMutation.mutate({
                  itemId: product.id,
                  ...values,
                })
              }
            />
            <HStack my={6}>
              <Separator flex="1" />
              <Text flexShrink="0" color="fg.muted">Movimentações</Text>
              <Separator flex="1" />
            </HStack>
            <MovementsList
              isLoading={isMovementsPending}
              movements={movements}
              unit={product.unit}
            />
          </>
        ) : null
      }
      onBack={() => navigate({ to: "/products" })}
      onDelete={() => deleteMutation.mutate(product.id)}
      product={product}
    />
  )
}
