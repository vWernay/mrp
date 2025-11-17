import { Flex, Text } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"

export function Footer() {
  const startYear = 2025
  const currentYear = new Date().getFullYear()
  const copyrightDate =
    startYear + (currentYear > startYear ? `-${currentYear}` : "")
  const copyrightName = "Car Garage - UDF"

  return (
    <Flex
      alignItems="center"
      as="footer"
      borderTop="1px solid"
      borderTopColor={useColorModeValue("gray.200", "gray.700")}
      flexDirection={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 0 }}
      justifyContent={{ base: "center", md: "space-between" }}
      mx="auto"
      paddingX={{ base: 4, md: 10 }}
      paddingY={6}
      w="full"
    >
      <Text
        color={useColorModeValue("gray.800", "gray.300")}
        fontSize="sm"
        textAlign="center"
      >
        &copy; {copyrightDate} {copyrightName}
        {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""} Todos
        os direitos reservados.
      </Text>
    </Flex>
  )
}
