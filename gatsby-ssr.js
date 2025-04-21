// gatsby-ssr.js
import * as React from "react"
import { ThemeProvider } from "./src/components/layout"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="font-satoshi"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700&display=swap"
    />,
  ])
}

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
