/**
 * Normalisasi tautan Google Maps agar siap dipakai sebagai src iframe.
 *
 * Google hanya mengizinkan embed via:
 *   1. https://www.google.com/maps/embed?pb=… (URL resmi, sangat panjang)
 *   2. https://maps.google.com/maps?q=…&output=embed (pendek, tanpa API key)
 *
 * Tautan "Bagikan" (`maps.app.goo.gl`, `/maps/place/<nama>/@lat,long,…`)
 * ditolak iframe (X-Frame-Options). Normalizer ini mengubahnya ke bentuk
 * `?q=…&output=embed` — jadi panjang URL di CMS tidak lagi masalah
 * (batas 255 karakter `string` ikut dihindari dengan tipe `text` di CMS).
 */
export function normalizeGmapsEmbed(mentah: string): string {
  const raw = (mentah ?? "").trim()
  if (!raw) return ""

  // Sudah siap embed → pakai apa adanya.
  if (/\/(maps\/)?embed/i.test(raw) || /output=embed/i.test(raw)) return raw

  let url: URL
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`)
  } catch {
    return raw
  }

  const host = url.hostname.replace(/^www\./, "")
  const diHostGoogle = host.includes("google") || host === "g.page"
  const pathMaps =
    url.pathname.startsWith("/maps") ||
    url.pathname.startsWith("/place/") ||
    url.pathname.startsWith("/search/")
  const isMaps =
    host === "maps.google.com" ||
    host === "maps.google.co.id" ||
    (diHostGoogle && pathMaps)

  if (!isMaps) return raw

  const q = url.searchParams.get("q") ?? ""
  // Zoom bisa di query (?z=) maupun di path (/place/…/@lat,lng,17z).
  const cocokZ = url.pathname.match(/@[-\d.]+,[-\d.]+(?:,(\d+)z)?/)
  const z = url.searchParams.get("z") ?? cocokZ?.[1] ?? ""
  // Koordinat dari link "Bagikan": /maps/place/…/@lat,lng,17z/…
  const cocokAt = url.pathname.match(/@([-\d.]+),([-\d.]+)/)
  const hanyaKoordinat = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(q)

  const muatan = hanyaKoordinat
    ? q
    : cocokAt
      ? `${cocokAt[1]},${cocokAt[2]}`
      : q
  if (!muatan) return raw

  const bagian = [
    `q=${encodeURIComponent(muatan).replaceAll("%2C", ",")}`,
    ...(z ? [`z=${z}`] : []),
    "output=embed",
    "hl=id",
  ]

  return `https://maps.google.com/maps?${bagian.join("&")}`
}

/** Ambil satu URL peta normalisasi (fallback untuk daftar kosong). */
export function petaUrlAman(mentah: string | undefined): string {
  return normalizeGmapsEmbed(mentah ?? "")
}
