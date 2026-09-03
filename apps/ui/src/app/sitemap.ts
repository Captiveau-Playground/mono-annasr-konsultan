import type { MetadataRoute } from "next"

import { artikel, layanan } from "@/data/perusahaan"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isDevelopment, isProduction } from "@/lib/general-helpers"
import { createPublicFullPath } from "@/lib/navigation"
import { publicBaseUrl } from "@/lib/seo/urls"

export const dynamic = "force-dynamic"

const rute = [
  "/",
  "/tentang",
  "/layanan",
  "/portfolio",
  "/klien",
  "/karir",
  "/kontak",
  "/artikel",
]

/**
 * Sitemap — halaman statis + detail layanan & artikel.
 * Slug detail diambil dari CMS (Strapi) dengan fallback data statis,
 * supaya konten yang baru dibuat ikut terindex.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isProduction() && !isDevelopment()) {
    return []
  }

  const baseUrl = publicBaseUrl()
  if (!baseUrl) return []

  const tgl = new Date()

  // Ambil slug CMS (idempotent; bila Strapi mati, pakai data statis).
  let slugLayanan = layanan.map((l) => l.slug)
  let slugArtikel = artikel.map((a) => a.slug)
  try {
    const konten = await fetchKontenSitus("en")
    const l = konten.layanan.map((x) => x.slug).filter(Boolean)
    const a = konten.artikel.map((x) => x.slug).filter(Boolean)
    if (l.length > 0) slugLayanan = l
    if (a.length > 0) slugArtikel = a
  } catch {
    // fallback statis sudah disiapkan
  }

  const urls: MetadataRoute.Sitemap = rute.map((path) => ({
    url: createPublicFullPath(path, "en"),
    lastModified: tgl,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }))

  for (const slug of slugLayanan) {
    urls.push({
      url: createPublicFullPath(`/layanan/${slug}`, "en"),
      lastModified: tgl,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  for (const slug of slugArtikel) {
    urls.push({
      url: createPublicFullPath(`/artikel/${slug}`, "en"),
      lastModified: tgl,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  }

  return urls
}
