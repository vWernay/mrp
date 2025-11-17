import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toaster } from "@/components/ui/toaster"
import { deleteItem, getItem } from "@/lib/api"
import { ProductDetailContent } from "@/components/products/product-detail-content"
import { ProductDetailError } from "@/components/products/product-detail-error"
import { ProductDetailInvalid } from "@/components/products/product-detail-invalid"
import { ProductDetailLoading } from "@/components/products/product-detail-loading"

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
          mutationError instanceof Error ? mutationError.message : "Tente novamente em breve.",
        type: "error",
        duration: 4000,
        closable: true,
      })
    },
  })

  if (Number.isNaN(itemId)) {
    return <ProductDetailInvalid onBackToList={() => navigate({ to: "/products" })} />
  }

  if (isPending) {
    return <ProductDetailLoading />
  }

  if (isError || !product) {
    return (
      <ProductDetailError
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        onBackToList={() => navigate({ to: "/products" })}
      />
    )
  }

  return (
    <ProductDetailContent
      product={product}
      onBack={() => navigate({ to: "/products" })}
      onDelete={() => deleteMutation.mutate(product.id)}
      onRequestStockMovement={() =>
        toaster.create({
          title: "Recurso em planejamento",
          description: "Movimentação de estoque será implementada em uma próxima etapa.",
          type: "info",
          duration: 3000,
          closable: true,
        })
      }
      isDeleting={deleteMutation.isPending}
    />
  )
}
