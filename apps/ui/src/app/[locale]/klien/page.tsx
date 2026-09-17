import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { KlienSection } from "@/components/sections/KlienSection"
import { PetaSection } from "@/components/sections/PetaSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Klien Kami — CV. AN NASR KONSULTAN"
const deskripsi =
  "Instansi pemerintah, lembaga pendidikan, dan mitra usaha yang telah bekerja sama dengan CV. AN NASR KONSULTAN di Jombang dan berbagai kota di Indonesia."

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const konten = await fetchKontenSitus(locale)
  const seo = konten.situs.seo?.klien

  return {
    title: seo?.judul || judul,
    description: seo?.deskripsi || deskripsi,
  }
}

export default async function KlienPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const konten = await fetchKontenSitus(locale)

  return (
    <>
      <PageHero
        eyebrow="Klien Kami"
        judul={konten.klienHero.judul}
        teks={konten.klienHero.deskripsi}
      />
      <KlienSection
        items={konten.klien}
        judul={konten.klienHero.judul || undefined}
      />
      <PetaSection
        kota={konten.tentang.kotaProyek}
        judul={konten.tentang.jangkauanJudul || undefined}
        brand={konten.situs.brandNama}
      />
      <CtaBanner
        judul={konten.beranda.cta?.judul}
        deskripsi={konten.beranda.cta?.deskripsi}
      />
    </>
  )
}
