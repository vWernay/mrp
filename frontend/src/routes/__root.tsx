import { Flex } from "@chakra-ui/react"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "../components/header"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

type MyRouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Flex direction="column" minHeight="100vh">
        <Header />
        <Outlet />
        <Footer />
        <Toaster />
      </Flex>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
})
