"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { useToast } from "@/hooks/use-toast"    //to get notifications on screen , have to use toast from hooks/use-toast

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]" />
    </ToastProvider>
  )
}

