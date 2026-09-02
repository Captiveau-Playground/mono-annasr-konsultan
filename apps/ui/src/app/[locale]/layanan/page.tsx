import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { LayananSection } from "@/components/sections/LayananSection"
import { ProsesSection } from "@/components/sections/ProsesSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Layanan — Perencanaan, Pengawasan, Perizinan & Konstruksi"
const deskripsi =
  "Lingkup layanan CV. AN NASR KONSULTAN: perencanaan gedung, jalan, jembatan, irigasi, pengawasan proyek, PBG, SLF, hingga pelaksanaan konstruksi."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function LayananPage({
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
        eyebrow="Layanan"
        judul="Layanan teknik yang lengkap dan terintegrasi"
        teks="Dari studi awal hingga serah terima pekerjaan, seluruh kebutuhan teknis proyek Anda dapat kami tangani dalam satu koordinasi."
      />
      <LayananSection lengkap />
      <ProsesSection />
      <CtaBanner />
    </>
  )
}
