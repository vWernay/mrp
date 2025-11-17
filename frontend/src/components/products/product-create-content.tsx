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
    <Container maxW="4xl" px={{ base: 4, md: 6 }} py={10}>
      <Stack gap={8}>
        <Stack gap={2}>
          <Text
            color="fg.muted"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
          >
            Produtos
          </Text>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Cadastrar produto
          </Text>
          <Text color="fg.muted">
            Preencha os dados para inserir um novo produto no estoque.
          </Text>
        </Stack>

        <Box
          as="form"
          bg="bg.surface"
          borderRadius="lg"
          borderWidth="1px"
          onSubmit={onSubmit}
          p={{ base: 6, md: 8 }}
        >
          <Stack gap={6}>
            <Field.Root invalid={Boolean(errors.name)} required>
              <Field.Label>
                Nome
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                autoFocus
                placeholder="Ex.: Notebook Pro 14"
                {...register("name", { required: "Informe o nome do produto" })}
              />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={Boolean(errors.category)} required>
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

            <Field.Root invalid={Boolean(errors.unit)} required>
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
              <Field.Root invalid={Boolean(errors.unitPrice)} required>
                <Field.Label>
                  Preço (R$)
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  min="0"
                  step="0.01"
                  type="number"
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

              <Field.Root invalid={Boolean(errors.quantity)} required>
                <Field.Label>
                  Quantidade
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  min="0"
                  step="1"
                  type="number"
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

            <Flex gap={3} justify="flex-end">
              {canGoBack && (
                <Button onClick={onBack} type="button" variant="ghost">
                  Cancelar
                </Button>
              )}
              <Button
                colorPalette="blue"
                loading={isSubmitting}
                loadingText="Salvando..."
                type="submit"
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
