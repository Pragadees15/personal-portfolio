"use client"

import { useEffect, useRef, useState } from "react"

function useLeaflet() {
  const [L, setL] = useState<typeof import("leaflet") | null>(null)
  const [LeafletDraw, setLeafletDraw] = useState<typeof import("leaflet-draw") | null>(null)

  useEffect(() => {
    async function loadLeaflet() {
      const leaflet = await import("leaflet")
      const leafletFullscreen = await import("leaflet.fullscreen")
      const leafletDraw = await import("leaflet-draw")

      const L_object = leaflet.default
      if (L_object.Control && !L_object.Control.FullScreen) {
        L_object.Control.FullScreen = leafletFullscreen.default || leafletFullscreen
      }

      setLeafletDraw(leafletDraw)
      setL(L_object)
    }

    if (L && LeafletDraw) return
    if (typeof window === "undefined") return

    loadLeaflet()
  }, [L, LeafletDraw])

  return { L, LeafletDraw }
}

function useDebounceLoadingState(delay = 200) {
  const [isLoading, setIsLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let raf: number | null = null
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      raf = requestAnimationFrame(() => setShowLoading(false))
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (raf !== null) {
        cancelAnimationFrame(raf)
      }
    }
  }, [isLoading, delay])

  return [showLoading, setIsLoading] as const
}

export { useLeaflet, useDebounceLoadingState }

