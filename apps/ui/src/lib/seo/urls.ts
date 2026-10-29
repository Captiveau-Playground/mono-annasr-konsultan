import { getEnvVar } from "@/lib/env-vars"

/**
 * Base URL publik tanpa trailing slash.
 * Fallback ke localhost saat dev & env belum diisi — mencegah runtime error
 * sebelum `APP_PUBLIC_URL` diset (di produksi wajib diisi).
 * Mengembalikan string kosong bila tidak tersedia (pemanggil harus guard).
 */
export function publicBaseUrl(): string {
  const dariEnv = getEnvVar("APP_PUBLIC_URL")?.replace(/\/$/, "")

  if (dariEnv) return dariEnv
  if (process.env.NODE_ENV === "development") return "http://localhost:3000"

  return ""
}

/**
 * Canonical + hreflang untuk satu halaman.
 *
 * - Default locale (`en` di routing, isinya bahasa Indonesia) = tanpa prefix.
 * - `cs` = prefix `/cs`.
 * - `languages` memberi sinyal hreflang `id`, `cs`, dan `x-default` supaya
 *   Google tidak menganggap halaman locale lain sebagai duplikat.
 */
export function alternatesUntuk(path: string, locale: string) {
  const tanpaSlash =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
  const bersih = tanpaSlash === "/" ? "" : tanpaSlash
  const kanonik = locale === "cs" ? `/cs${bersih || ""}` : bersih || "/"

  return {
    canonical: kanonik || "/",
    languages: {
      id: bersih || "/",
      cs: `/cs${bersih || ""}`,
      "x-default": bersih || "/",
    },
  }
}
