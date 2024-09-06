'use client'

import { ToastProvider as RadixToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixToastProvider>
      {children}
      <Toaster />
    </RadixToastProvider>
  )
}