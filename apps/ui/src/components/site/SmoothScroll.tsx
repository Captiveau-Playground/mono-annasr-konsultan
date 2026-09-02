"use client"

import LocomotiveScroll from "locomotive-scroll"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Smooth scroll (Locomotive Scroll v5 — berbasis Lenis, native scroll,
 * sehingga navbar fixed, IntersectionObserver, dan Leaflet tetap normal).
 * Reset ke atas pada setiap ganti rute dan matikan scroll-restoration lama.
 */
export function SmoothScroll() {
  const pathname = usePathname()
  const pathRef = useRef(pathname)
  const lsRef = useRef<LocomotiveScroll | null>(null)

  useEffect(() => {
    history.scrollRestoration = "manual"

    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const ls = new LocomotiveScroll({
      autoStart: true,
      lenisOptions: {
        smoothWheel: !kurangiGerak,
        lerp: 0.09,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      },
    })
    lsRef.current = ls

    return () => {
      ls.destroy()
      lsRef.current = null
    }
  }, [])

  useEffect(() => {
    if (pathname === pathRef.current) return
    pathRef.current = pathname
    // Instan begitu halaman berganti — jangan biarkan posisi lama terbawa.
    lsRef.current?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
