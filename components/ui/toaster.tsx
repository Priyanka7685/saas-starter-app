"use client"

import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { Button } from "@/components/ui/button"


export function Toaster() {
    const [toasts, setToasts] = useState<{ 
      id: number; 
      title?: string; 
      description?: string; 
    }[]>([]);

//   Function to add toast
const addToast = (title: string, description: string) => {
    setToasts((prev: any) => [
        ...prev,
        { id: Date.now(), title, description }
    ])
    setTimeout(() => removeToast(Date.now()), 3000)
}

// Function to remove toast
const removeToast = (id: number) => {
    setToasts((prev: any) => prev.filter((toast: { id: number; }) => toast.id !== id)
)
}
  return (
    <ToastProvider>
        <Button className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
        onClick={() =>
          addToast("Success", "Your action was completed successfully.")
        }
      >
        Show Toast
      </Button>
      
      {toasts.map(function ({ id, title, description}) {
        return (
          <Toast key={id} onOpenChange={() => removeToast(id)}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      {/* <ToastViewport className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"/> */}
    </ToastProvider>
  )
}

// function removeToast(arg0: number): void {
//     throw new Error("Function not implemented.");
// }
