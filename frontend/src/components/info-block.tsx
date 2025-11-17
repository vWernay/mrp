import { Stack, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"

type InfoBlockProps = {
  label: string
  value: string
  extra?: ReactNode
}

export default function InfoBlock({ label, value, extra }: InfoBlockProps) {
  return (
    <Stack gap={1}>
      <Text
        color="fg.muted"
        fontSize="sm"
        fontWeight="semibold"
        letterSpacing="wide"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Text fontSize="xl" fontWeight="bold">
        {value}
      </Text>
      {extra}
    </Stack>
  )
}
