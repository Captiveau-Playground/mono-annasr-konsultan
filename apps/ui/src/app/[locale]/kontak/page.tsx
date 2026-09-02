import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { KontakSection } from "@/components/sections/KontakSection"
import { PageHero } from "@/components/site/PageHero"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Kontak — CV. AN NASR KONSULTAN Jombang"
const deskripsi =
  "Hubungi CV. AN NASR KONSULTAN untuk konsultasi proyek perencanaan, pengawasan, perizinan, dan konstruksi di Kabupaten Jombang, Jawa Timur."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function KontakPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  return (
    <>
      <PageHero
        eyebrow="Kontak"
        judul="Mari bicarakan rencana proyek Anda"
        teks="Tim kami siap membantu menghitung kebutuhan teknis, dokumen perizinan, hingga estimasi biaya pekerjaan."
      />
      <KontakSection />
    </>
  )
}
