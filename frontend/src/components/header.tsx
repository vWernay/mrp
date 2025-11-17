import {
  Avatar,
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  Text,
} from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import logo_512x512 from "@/../public/logo_512x512.webp"
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode"

export function Header() {
  return (
    <Flex
      alignItems="center"
      as="header"
      backdropFilter="blur(48px)"
      bg={useColorModeValue("gray.100/60", "gray.900/60")}
      height={16}
      justifyContent="space-between"
      position="sticky"
      px={4}
      top={0}
      zIndex="docked"
    >
      {/* Server name, Logo and Navigation */}
      <HStack gap="2rem">
        <Text asChild fontSize="lg" fontWeight={600}>
          <Link to="/">
            <Flex alignItems="center" gap="1rem">
              <Image alt="Logotipo" height="3rem" src={logo_512x512} />
              {"MRP UDF"}
            </Flex>
          </Link>
        </Text>
        <HStack gap="2rem">
          <Text asChild fontSize="md">
            <Link to="/products">Produtos</Link>
          </Text>
          <Text asChild fontSize="md">
            <Link to="/reports">Relatórios</Link>
          </Text>
        </HStack>
      </HStack>

      {/* User Avatar + Auth logics */}
      <HStack>
        <Popover.Root size="sm">
          <Popover.Trigger asChild>
            <Button size="sm" variant="ghost">
              <Avatar.Root>
                <Avatar.Fallback name={"Usuário"} />
                <Avatar.Image src={undefined} />
              </Avatar.Root>
            </Button>
          </Popover.Trigger>
        </Popover.Root>

        {/* Color Mode Button */}
        <ColorModeButton />
      </HStack>
    </Flex>
  )
}
