/**
 * Google Tag Manager — snippet resmi yang dirender dari server.
 *
 * Kenapa tidak lewat `next/script` / `@next/third-parties`?
 * Di App Router, `next/script` strategy `afterInteractive` (default) hanya
 * mengeluarkan `<link rel="preload">` saat SSR — `<script>`-nya baru diinject
 * setelah hydration. Akibatnya:
 *   1. HTML mentah tidak memuat `gtm.js`, sehingga checker instalasi Google
 *      ("Google tag wasn't detected") selalu gagal walau tag jalan di browser.
 *   2. Event yang terjadi sebelum hydration (bounce cepat) hilang.
 *
 * Dengan merender snippet sebagai inline script dari Server Component, tag
 * ikut di HTML awal — terdeteksi checker, dan tidak bergantung pada JS React.
 *
 * Referensi: `deploy/ANALYTICS.md`.
 */

/**
 * Container ID default (dipakai bila env `GTM_ID` kosong/tidak diset).
 *
 * Container ID bersifat publik — nilainya memang tampil di HTML — dan sengaja
 * punya default agar `docker compose up` tetap menghasilkan tag tanpa perlu
 * menyentuh `.env` di server. Set `GTM_ID` di environment untuk menimpanya.
 */
export const DEFAULT_GTM_ID = "GTM-TJPCCLSL"

/** Format container GTM yang valid (`GTM-XXXXXXX`). */
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i

export function isValidGtmId(gtmId: string): boolean {
  return GTM_ID_PATTERN.test(gtmId)
}

/**
 * Snippet installer GTM resmi (varian inline, tanpa `gtag()` shim).
 * `gtmId` sudah divalidasi sebelum masuk ke sini agar tidak bisa dipakai
 * untuk menyuntikkan markup lain.
 */
export function buildGtmSnippet(gtmId: string): string {
  return [
    "(function(w,d,s,l,i){w[l]=w[l]||[];",
    "w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});",
    "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),",
    "dl=l!='dataLayer'?'&l='+l:'';j.async=true;",
    "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;",
    "f.parentNode.insertBefore(j,f);",
    `})(window,document,'script','dataLayer','${gtmId}');`,
  ].join("")
}

/** URL iframe `<noscript>` GTM (untuk pengunjung tanpa JavaScript). */
export function buildGtmNoScriptUrl(gtmId: string): string {
  return `https://www.googletagmanager.com/ns.html?id=${gtmId}`
}
