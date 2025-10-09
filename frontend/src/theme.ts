import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Lato', sans-serif` },
        body: { value: `'Lato', sans-serif` },
      },
    },
  },
  globalCss: {
    "html, body, #app": {
      height: "100%",
    },
  },
})

export const system = createSystem(defaultConfig, config)
