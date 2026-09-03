"use client"

import { GoogleTagManager } from "@next/third-parties/google"

/**
 * Snippet GTM resmi dari `@next/third-parties` (head + noscript iframe).
 * `gtmId` diterima sebagai prop dari server runtime env — sehingga gambar
 * Docker "build once, deploy many" tetap bisa punya ID berbeda per env.
 */
export function GoogleTagManagerClient({ gtmId }: { gtmId: string }) {
  return <GoogleTagManager gtmId={gtmId} />
}
