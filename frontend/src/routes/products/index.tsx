import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { useState } from "react"
import { ProductsError } from "@/components/products/products-error"
import { ProductsListContent } from "@/components/products/products-list-content"
import { ProductsLoading } from "@/components/products/products-loading"
import { toaster } from "@/components/ui/toaster"
import { deleteItem, getItems } from "@/lib/api"

export const Route = createFileRoute("/products/")({
  component: ProductsListRoute,
})

const pageSize = 10

function ProductsListRoute() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const [deletingId, setDeletingId] = useState<number | null>(null)

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onMutate: async (itemId: number) => {
      setDeletingId(itemId)
    },
    onSuccess: () => {
      toaster.create({
        title: "Produto removido",
        description: "O item foi excluído do estoque.",
        type: "success",
        duration: 3500,
        closable: true,
      })
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
    onError: (mutationError: unknown) => {
      toaster.create({
        title: "Não foi possível remover",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Tente novamente em instantes.",
        type: "error",
        duration: 4000,
        closable: true,
      })
    },
    onSettled: () => {
      setDeletingId(null)
    },
  })

  if (isPending) {
    return <ProductsLoading />
  }

  if (isError) {
    return (
      <ProductsError
        error={error instanceof Error ? error : null}
        onRetry={refetch}
      />
    )
  }

  return (
    <ProductsListContent
      canGoBack={canGoBack}
      deletingId={deletingId}
      isDeleting={deleteMutation.isPending}
      items={items}
      onBack={() => router.history.back()}
      onCreate={() => navigate({ to: "/products/new" })}
      onDelete={(id) => deleteMutation.mutate(id)}
      onViewDetails={(id) =>
        navigate({ to: "/products/$id", params: { id: id.toString() } })
      }
      pageSize={pageSize}
    />
  )
}
