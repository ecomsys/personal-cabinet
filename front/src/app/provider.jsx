import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router"

import OrientationGuard from "./orientation-guard"
import autoRem from "@/utils/auto-rem"
import { BaseUrlNoSlash } from "@/utils/resolvers"
import { useAuthStore } from "../store/auth.store"

import { Toaster } from "react-hot-toast";

export function AppProviders() {
  const [visible, setVisible] = useState(false)
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    const cleanup = autoRem(1536, 16)

    queueMicrotask(() => {
      setVisible(true)
    })

    //  ВСЕГДА init один раз при старте
    init()

    return () => cleanup()
  }, [])

  return (
    <BrowserRouter basename={BaseUrlNoSlash()}>
      <OrientationGuard>
        <div className={`relative app ${visible ? "app--visible" : ""}`}>
          <Toaster position="top-center" />
          <AppRouter />
        </div>
      </OrientationGuard>
    </BrowserRouter>
  )
}