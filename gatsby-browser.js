import "@fontsource-variable/montserrat"
import "@fontsource/merriweather"
import "./src/normalize.css"
import "./src/style.css"  // This must be correctly referenced
import "prismjs/themes/prism.css"

// Wrap your app with the ThemeProvider (from layout.js in your case)
import * as React from 'react'
import { ThemeProvider } from './src/components/layout'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
