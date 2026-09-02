"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Setiap ganti rute (termasuk tombol back/forward) posisi scroll di-reset ke
 * paling atas. Scroll restoration browser dimatikan agar tidak bertabrakan,
 * dan reset dilakukan dua kali (seketika + setelah paint) untuk mengalahkan
 * scroll anchoring / restorasi Next dan animasi smooth-scroll CSS.
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    history.scrollRestoration = "manual"
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    })

    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}
