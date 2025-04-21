// gatsby-browser.js
import * as React from "react"
import { ThemeProvider } from "./src/components/layout"

import "@fontsource/merriweather"     /* keep if you still need Merriweather */
import "./src/normalize.css"
import "./src/style.css"
import "prismjs/themes/prism.css"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
