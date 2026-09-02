import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { CtaBanner } from "@/components/site/CtaBanner"
import { Founder } from "@/components/tentang/Founder"
import { JangkauanTentang } from "@/components/tentang/JangkauanTentang"
import { KenapaKami } from "@/components/tentang/KenapaKami"
import { KisahPerusahaan } from "@/components/tentang/KisahPerusahaan"
import { TentangHero } from "@/components/tentang/TentangHero"
import { TentangInti } from "@/components/tentang/TentangInti"
import { TimTentang } from "@/components/tentang/TimTentang"
import { VisiMisi } from "@/components/tentang/VisiMisi"
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
      <TentangHero />
      <TentangInti />
      <KisahPerusahaan />
      <VisiMisi />
      <Founder />
      <TimTentang />
      <KenapaKami />
      <JangkauanTentang />
      <CtaBanner />
    </>
  )
}
