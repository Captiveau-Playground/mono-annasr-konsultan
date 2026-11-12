import {
  buildGtmNoScriptUrl,
  buildGtmSnippet,
  isValidGtmId,
} from "@/lib/analytics/gtm"

/**
 * Render tag GTM langsung dari Server Component.
 *
 * Dicetak sebagai inline `<script>` di HTML awal, jadi:
 *  - checker instalasi Google mendeteksinya (`gtm.js?id=GTM-…` ada di source),
 *  - tag mulai jalan tanpa menunggu hydration React.
 *
 * CSP sudah mengizinkan keduanya (`script-src 'unsafe-inline'` +
 * `https://www.googletagmanager.com`, `frame-src` untuk iframe noscript) —
 * lihat `src/lib/proxies/securityHeaders.ts`.
 */
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  // Guard: jangan pernah render ID yang formatnya tidak dikenal.
  if (!isValidGtmId(gtmId)) return null

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: buildGtmSnippet(gtmId) }} />
      <noscript>
        <iframe
          src={buildGtmNoScriptUrl(gtmId)}
          height="0"
          width="0"
          title="Google Tag Manager"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  )
}
