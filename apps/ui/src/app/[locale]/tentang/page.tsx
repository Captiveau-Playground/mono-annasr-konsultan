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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const k = await fetchKontenSitus(locale)
  const seo = k.situs.seo?.tentang

  return {
    title: seo?.judul || judul,
    description: seo?.deskripsi || deskripsi,
  }
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
        statistik={konten.statistik}
        gambar={konten.hero.gambar?.[0]}
      />
      <TentangInti
        judul={konten.tentangInti.judul || undefined}
        deskripsi={konten.tentangInti.deskripsi || undefined}
        poin={konten.tentangInti.daftar}
        statistik={konten.statistik}
        brand={k.situs.brandNama || undefined}
        gambar={konten.tentangGambar || undefined}
      />
      <KisahPerusahaan
        perjalanan={konten.perjalanan}
        judul={k.situs.perjalananJudul || undefined}
        deskripsi={k.situs.perjalananDeskripsi || undefined}
      />
      <VisiMisi
        kartu={konten.visiMisi}
        judul={k.situs.visiMisiJudul || undefined}
      />
      <Founder data={konten.founder} />
      <TimTentang
        tim={konten.tim}
        judul={k.situs.timJudul || undefined}
        deskripsi={k.situs.timDeskripsi || undefined}
      />
      <JangkauanSection
        judul={konten.jangkauanJudul}
        deskripsi={konten.jangkauanDeskripsi}
        kota={konten.kotaProyek}
        statistik={konten.statistik}
        brand={k.situs.brandNama}
      />
      <CtaBanner
        judul={k.beranda.cta?.judul}
        deskripsi={k.beranda.cta?.deskripsi}
      />
    </>
  )
}
