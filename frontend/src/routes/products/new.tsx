import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { ProductCreateContent } from "@/components/products/product-create-content"
import type { ProductFormValues } from "@/components/products/types"
import { toaster } from "@/components/ui/toaster"
import { createItem } from "@/lib/api"

export const Route = createFileRoute("/products/new")({
  component: ProductCreateRoute,
})

function ProductCreateRoute() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      unitPrice: 0,
      quantity: 0,
    },
    mode: "onBlur",
  })

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: (item) => {
      toaster.create({
        title: "Produto cadastrado",
        description: "O estoque foi atualizado com o novo item.",
        type: "success",
        duration: 3500,
        closable: true,
      })
      queryClient.invalidateQueries({ queryKey: ["items"] })
      reset()
      navigate({ to: "/products/$id", params: { id: item.id.toString() } })
    },
    onError: (error) => {
      toaster.create({
        title: "Não foi possível salvar",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em instantes.",
        type: "error",
        duration: 4000,
        closable: true,
      })
    },
  })

  const onSubmit = handleSubmit((values) => {
    mutation.mutate({
      name: values.name.trim(),
      category: values.category.trim(),
      unit: values.unit.trim(),
      quantity: values.quantity,
      unitPrice: values.unitPrice,
    })
  })

  return (
    <ProductCreateContent
      canGoBack={canGoBack}
      errors={errors}
      isSubmitting={mutation.isPending}
      onBack={() => router.history.back()}
      onSubmit={onSubmit}
      register={register}
    />
  )
}
