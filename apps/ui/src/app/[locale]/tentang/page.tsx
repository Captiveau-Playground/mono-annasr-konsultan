import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { JangkauanSection } from "@/components/sections/JangkauanSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { Founder } from "@/components/tentang/Founder"
import { KisahPerusahaan } from "@/components/tentang/KisahPerusahaan"
import { TentangHero } from "@/components/tentang/TentangHero"
import { TentangInti } from "@/components/tentang/TentangInti"
import { TimTentang } from "@/components/tentang/TimTentang"
import { VisiMisi } from "@/components/tentang/VisiMisi"
import { fetchKontenSitus } from "@/lib/annasr/konten"
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

  const k = await fetchKontenSitus(locale)
  const konten = k.tentang

  return (
    <>
      <TentangHero
        judul={konten.hero.judul}
        deskripsi={konten.hero.deskripsi}
        keunggulan={konten.hero.keunggulan}
      />
      <TentangInti statistik={konten.statistik} />
      <KisahPerusahaan perjalanan={konten.perjalanan} />
      <VisiMisi kartu={konten.visiMisi} />
      <Founder data={konten.founder} />
      <TimTentang tim={konten.tim} />
      <JangkauanSection
        judul={konten.jangkauanJudul}
        deskripsi={konten.jangkauanDeskripsi}
        kota={konten.kotaProyek}
      />
      <CtaBanner />
    </>
  )
}
