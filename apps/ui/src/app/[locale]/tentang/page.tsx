import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { TentangSection } from "@/components/sections/TentangSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Tentang Kami — CV. AN NASR KONSULTAN"
const deskripsi =
  "Profil, visi, misi, dan nilai perusahaan CV. AN NASR KONSULTAN, konsultan teknik sipil dan konstruksi di Kabupaten Jombang."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function TentangPage({
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
        eyebrow="Tentang Kami"
        judul="Mitra teknik yang tumbuh bersama pembangunan daerah"
        teks="Kami hadir untuk memastikan setiap rencana pembangunan berjalan dengan perhitungan yang matang dan pelaksanaan yang bertanggung jawab."
      />
      <TentangSection />
      <CtaBanner />
    </>
  )
}
