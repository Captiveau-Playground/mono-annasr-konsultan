import { getEnvVar } from "@/lib/env-vars"

import { ClarityScript } from "./ClarityScript"
import { GoogleTagManagerClient } from "./GoogleTagManagerClient"

/**
 * Analytics global (Server Component): membaca env runtime lalu merender
 * GTM (GA4 lewat GTM) dan/atau Microsoft Clarity.
 *
 * Tanpa `GTM_ID` / `MS_CLARITY_ID` → tidak merender apa pun (dev aman).
 *
 * Rute yang boleh di-lewati: halaman admin/CMS tidak memakai komponen ini.
 */
export function Analytics() {
  const gtmId = getEnvVar("GTM_ID")
  const clarityId = getEnvVar("MS_CLARITY_ID")

  if (!gtmId && !clarityId) return null

  return (
    <>
      {gtmId ? <GoogleTagManagerClient gtmId={gtmId} /> : null}
      {clarityId ? <ClarityScript clarityId={clarityId} /> : null}
    </>
  )
}
