"use client"

/**
 * The above function is a wrapper component that provides theme functionality to its children using
 * the NextThemesProvider component from the next-themes library.
 * @param {ThemeProviderProps}  - - `React`: This is the default import for the React library, which is
 * used to create and manage React components.
 * @returns The `ThemeProvider` component is being returned.
 */
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
