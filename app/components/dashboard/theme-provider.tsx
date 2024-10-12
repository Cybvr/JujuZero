"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const updateThemeColor = (theme: string) => {
    const themeColor = theme === 'dark' ? '#000000' : '#ffffff'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
  }

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme')
          if (theme) updateThemeColor(theme)
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}