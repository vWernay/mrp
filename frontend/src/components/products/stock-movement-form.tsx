import {
  Box,
  Button,
  Field,
  HStack,
  Input,
  RadioGroup,
  Stack
} from "@chakra-ui/react"
import { Controller, useForm } from "react-hook-form"

export type StockMovementFormValues = {
  movementType: "entry" | "exit"
  quantity: number
  unitPrice?: number
}

interface StockMovementFormProps {
  unit: string
  defaultUnitPrice: number
  isSubmitting?: boolean
  onSubmit: (values: StockMovementFormValues) => void
}

const radioItems = [
  { value: "entry", label: "Entrada" },
  { value: "exit", label: "Saída" },
]

export function StockMovementForm({
  unit,
  defaultUnitPrice,
  isSubmitting = false,
  onSubmit,
}: StockMovementFormProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<StockMovementFormValues>({
    mode: "onBlur",
    defaultValues: {
      movementType: "entry",
      quantity: 1,
      unitPrice: defaultUnitPrice,
    },
  })

  const movementType = watch("movementType")

  const submit = handleSubmit((values) => {
    onSubmit({
      movementType: values.movementType,
      quantity: Number(values.quantity),
      unitPrice:
        values.unitPrice !== undefined && values.unitPrice !== null
          ? Number(values.unitPrice)
          : undefined,
    })
    reset({
      movementType: values.movementType,
      quantity: 1,
      unitPrice: values.unitPrice,
    })
  })

  return (
    <form onSubmit={submit}>
      <Stack gap={4}>
        <Field.Root>
          <Field.Label>Tipo de movimentação</Field.Label>
          <Controller
            name="movementType"
            control={control}
            render={({ field }) => (
              <RadioGroup.Root
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => {
                  field.onChange(value)
                }}
              >
                <HStack gap="6" mt={2}>
                  {radioItems.map((item) => (
                    <RadioGroup.Item key={item.value} value={item.value}>
                      <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  ))}
                </HStack>
              </RadioGroup.Root>
            )}
          />
        </Field.Root>

        <Field.Root invalid={!!errors.quantity}>
          <Field.Label>Quantidade ({unit})</Field.Label>
          <Input
            min={0.000001}
            step="any"
            type="number"
            {...register("quantity", { required: true, min: 0.000001 })}
          />
          <Field.ErrorText>
            Informe uma quantidade válida maior que zero.
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.unitPrice}>
          <Field.Label>Preço unitário (opcional)</Field.Label>
          <Input
            min={0}
            step="any"
            type="number"
            {...register("unitPrice", { min: 0 })}
          />
          <Field.HelperText>
            Se vazio, mantém o preço atual do item.
          </Field.HelperText>
        </Field.Root>

        <Box>
          <Button loading={isSubmitting} loadingText="Registrando..." type="submit">
            Registrar {movementType === "entry" ? "entrada" : "saída"}
          </Button>
        </Box>
      </Stack>
    </form>
  )
}
