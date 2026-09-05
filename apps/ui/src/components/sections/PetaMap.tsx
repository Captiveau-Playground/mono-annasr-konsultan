"use client"

import type { Map as LeafletMap } from "leaflet"
import { useEffect, useRef } from "react"

import { kotaProyek } from "@/data/perusahaan"
import { getEnvVar } from "@/lib/env-vars"

/**
 * Peta interaktif jangkauan proyek — Leaflet (gratis, tanpa API key) dengan
 * tile CARTO Voyager dan pin custom berwarna aksen brand. Diinisialisasi di
 * useEffect jadi aman untuk SSR (Leaflet hanya diload di sisi klien).
 */
export function PetaMap({
  kota,
}: {
  kota?: { nama: string; lat: number; lng: number }[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let map: LeafletMap | null = null
    let dibatalkan = false

    void (async () => {
      // Idempotent: skip if cancelled OR the container already hosts a map
      // (StrictMode re-runs effects in dev).
      if (
        dibatalkan ||
        containerRef.current?.classList.contains("leaflet-container")
      ) {
        return
      }
      const L = await import("leaflet")

      try {
        map = L.map(containerRef.current!, {
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
        })
      } catch {
        // Container is already hosting a live map (dev StrictMode re-mount)
        return
      }

      const kartokunci = getEnvVar("NEXT_PUBLIC_CARTO_BASEMAPS_KEY")
      // Dengan key CARTO → tile Voyager tanpa watermark. Tanpa key → tile
      // OpenStreetMap standar (tetap wajib atribusi, tapi tanpa watermark
      // tile seperti gratis-an CARTO).
      const polaTile = kartokunci
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=" +
          kartokunci
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

      L.tileLayer(polaTile, {
        attribution: kartokunci
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: kartokunci ? ["a"] : ["a", "b", "c"],
        maxZoom: kartokunci ? 20 : 19,
      }).addTo(map)

      const daftarKota = kota ?? kotaProyek
      const koordinat: [number, number][] = daftarKota.map((k) => [
        k.lat,
        k.lng,
      ])
      const bounds = L.latLngBounds(koordinat)

      const ikon = L.divIcon({
        className: "",
        html: '<span class="peta-pin" aria-hidden="true"></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10],
      })

      for (const kota of daftarKota) {
        // Decorative pins → keyboard: false (tanpa role/tabindex command),
        // dan tanpa aria-label (dilarang pada div tanpa role). Nama lokasi
        // sudah tersedia lewat tooltip/popup + aria-label pada container peta.
        const marker = L.marker([kota.lat, kota.lng], {
          icon: ikon,
          keyboard: false,
        })
        marker
          .addTo(map)
          .bindTooltip(kota.nama, { direction: "top", offset: [0, -6] })
          .bindPopup(
            `<strong>${kota.nama}</strong><br /><span style="font-size:12px">Kota proyek CV. AN NASR KONSULTAN</span>`
          )
      }

      map.fitBounds(bounds.pad(0.12))
    })()

    return () => {
      dibatalkan = true
      map?.remove()
      // Reset the container so a StrictMode re-mount can re-initialize cleanly.
      containerRef.current?.classList.remove("leaflet-container")
    }
  }, [])

  return (
    <>
      <link
        rel="preconnect"
        href="https://a.basemaps.cartocdn.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://tile.openstreetmap.org"
        crossOrigin="anonymous"
      />
      <div
        className="border-border bg-surface relative z-0 h-[24rem] w-full overflow-hidden rounded-xl border sm:h-[30rem]"
        ref={containerRef}
        aria-label="Peta persebaran lokasi proyek CV. AN NASR KONSULTAN di Indonesia"
      />
    </>
  )
}
