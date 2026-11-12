import { DEFAULT_GTM_ID } from "@/lib/analytics/gtm"
import { getEnvVar } from "@/lib/env-vars"

import { ClarityScript } from "./ClarityScript"
import { GoogleTagManager } from "./GoogleTagManager"

/**
 * Analytics global (Server Component): membaca env runtime lalu merender
 * GTM (GA4 dikelola di dalam container GTM) dan/atau Microsoft Clarity.
 *
 * `GTM_ID` punya default (`DEFAULT_GTM_ID`) supaya tag tetap terpasang tanpa
 * konfigurasi tambahan di server; set `GTM_ID` untuk menimpanya per environment.
 * Tanpa `MS_CLARITY_ID` → Clarity tidak dimuat.
 *
 * Rute admin/CMS tidak memakai komponen ini.
 */
export function Analytics() {
  const gtmId = getEnvVar("GTM_ID") ?? DEFAULT_GTM_ID
  const clarityId = getEnvVar("MS_CLARITY_ID")

  return (
    <>
      <GoogleTagManager gtmId={gtmId} />
      {clarityId ? <ClarityScript clarityId={clarityId} /> : null}
    </>
  )
}
