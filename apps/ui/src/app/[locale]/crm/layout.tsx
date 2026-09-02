import type { Metadata } from "next"

import { CrmProvider } from "@/lib/crm/crm-store"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "CRM Internal — CV. AN NASR KONSULTAN",
  description:
    "Area internal CV. AN NASR KONSULTAN untuk pengelolaan lead, klien, dan proyek.",
  robots: { index: false, follow: false },
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <CrmProvider>{children}</CrmProvider>
}
