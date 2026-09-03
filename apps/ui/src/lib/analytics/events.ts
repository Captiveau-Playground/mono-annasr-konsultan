/**
 * Event analytics (Google Tag Manager → GA4 + MS Clarity).
 *
 * Aturan penamaan: `object_action` huruf kecil dengan underscore,
 * konteks ditaruh di property, bukan di nama event.
 *
 * Reference tracking plan: `deploy/ANALYTICS.md`.
 */
export const ANALYTICS_EVENTS = {
  /** CTA diklik — property: `cta` (cta:hero_konsultasi, cta:layanan_card, …) */
  ctaClicked: "cta_clicked",
  /** Kontak via kanal — property: `channel` (whatsapp/phone/email/maps) */
  contactChannel: "contact_channel_clicked",
  /** Formulir terkirim — property: `form` (kontak) */
  formSubmitted: "form_submitted",
  /** Artikel dibuka — property: `slug` */
  articleRead: "article_read",
} as const

export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/**
 * Kirim event ke dataLayer GTM. Aman dipanggil kapan saja:
 * bila GTM belum termuat / tak terpasang, push tidak berdampak apa-apa.
 */
export function trackEvent(event: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return

  try {
    const win = window as Window & { dataLayer?: unknown[] }
    if (!Array.isArray(win.dataLayer)) {
      win.dataLayer = []
    }
    win.dataLayer.push({ event, ...params })
  } catch {
    // Tracking tidak boleh merusak UX.
  }
}
