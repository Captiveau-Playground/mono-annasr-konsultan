import "server-only"

/**
 * TTL Data Cache Next.js untuk fetch konten Strapi (ISR).
 *
 * Nilai ini adalah safety-net: berapa detik maksimum data boleh basi sebelum
 * Next.js refetch ke Strapi. Update yang dilakukan lewat CMS tetap tampil
 * realtime karena auto-revalidate (tag) meng-invalidate cache saat publish —
 * TTL hanya berlaku ketika tidak ada trigger revalidate.
 *
 * Bisa diubah per lingkingan lewat env:
 *   STRAPI_CACHE_TTL=10   → testing/QA (ngebut, Strapi lebih sering kena panggil)
 *   STRAPI_CACHE_TTL=0    → tanpa cache sama sekali (setiap view fetch ke Strapi)
 *   (tidak di-set)        → default 120
 */
const STRAPI_CACHE_TTL = (() => {
  const raw = process.env.STRAPI_CACHE_TTL
  if (raw == null) return 120

  const nilai = Number(raw)

  return Number.isFinite(nilai) && nilai >= 0 ? nilai : 120
})()

export { STRAPI_CACHE_TTL }
