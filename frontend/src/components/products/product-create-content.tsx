import {
  Box,
  Button,
  Container,
  Field,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProductFormValues } from "./types"

interface ProductCreateContentProps {
  canGoBack: boolean
  onBack: () => void
  onSubmit: React.FormEventHandler<HTMLFormElement>
  register: UseFormRegister<ProductFormValues>
  errors: FieldErrors<ProductFormValues>
  isSubmitting: boolean
}

export function ProductCreateContent({
  canGoBack,
  onBack,
  onSubmit,
  register,
  errors,
  isSubmitting,
}: ProductCreateContentProps) {
  return (
    <Container maxW="4xl" py={10} px={{ base: 4, md: 6 }}>
      <Stack gap={8}>
        <Stack gap={2}>
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase">
            Produtos
          </Text>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Cadastrar produto
          </Text>
          <Text color="fg.muted">Preencha os dados para inserir um novo produto no estoque.</Text>
        </Stack>

        <Box
          as="form"
          borderWidth="1px"
          borderRadius="lg"
          bg="bg.surface"
          p={{ base: 6, md: 8 }}
          onSubmit={onSubmit}
        >
          <Stack gap={6}>
            <Field.Root required invalid={Boolean(errors.name)}>
              <Field.Label>
                Nome
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="Ex.: Notebook Pro 14"
                autoFocus
                {...register("name", { required: "Informe o nome do produto" })}
              />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={Boolean(errors.category)}>
              <Field.Label>
                Categoria
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="Ex.: Eletrônicos"
                {...register("category", { required: "Informe a categoria" })}
              />
              <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={Boolean(errors.unit)}>
              <Field.Label>
                Unidade
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="Ex.: un, cx, kg"
                {...register("unit", { required: "Informe a unidade" })}
              />
              <Field.ErrorText>{errors.unit?.message}</Field.ErrorText>
            </Field.Root>

            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              <Field.Root required invalid={Boolean(errors.unitPrice)}>
                <Field.Label>
                  Preço (R$)
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("unitPrice", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "O preço deve ser positivo",
                    },
                    required: "Informe o preço",
                  })}
                />
                <Field.ErrorText>{errors.unitPrice?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={Boolean(errors.quantity)}>
                <Field.Label>
                  Quantidade
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...register("quantity", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "A quantidade deve ser positiva",
                    },
                    required: "Informe a quantidade",
                  })}
                />
                <Field.ErrorText>{errors.quantity?.message}</Field.ErrorText>
              </Field.Root>
            </Flex>

            <Flex justify="flex-end" gap={3}>
              {canGoBack && (
                <Button type="button" variant="ghost" onClick={onBack}>
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                colorPalette="blue"
                loading={isSubmitting}
                loadingText="Salvando..."
              >
                Salvar produto
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
