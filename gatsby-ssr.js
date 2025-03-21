import * as React from 'react'
import { ThemeProvider } from './src/components/layout'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
