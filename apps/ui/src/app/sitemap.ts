import type { MetadataRoute } from "next"

import { layanan } from "@/data/perusahaan"
import { getEnvVar } from "@/lib/env-vars"
import { isDevelopment, isProduction } from "@/lib/general-helpers"
import { createPublicFullPath } from "@/lib/navigation"

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
 * Sitemap untuk website statis An Nasr Blueprint — tidak lagi mengambil
 * halaman dari Strapi.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction() && !isDevelopment()) {
    return []
  }

  const baseUrl = getEnvVar("APP_PUBLIC_URL", true)
  if (!baseUrl) return []

  const tgl = new Date()
  const urls: MetadataRoute.Sitemap = rute.map((path) => ({
    url: createPublicFullPath(path, "en"),
    lastModified: tgl,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }))

  for (const l of layanan) {
    urls.push({
      url: createPublicFullPath(`/layanan/${l.slug}`, "en"),
      lastModified: tgl,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  return urls
}
