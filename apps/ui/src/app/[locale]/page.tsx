import {
  Building2,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  type LucideIcon,
} from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { ArtikelSection } from "@/components/sections/ArtikelSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { FounderSection } from "@/components/sections/FounderSection"
import { Hero } from "@/components/sections/Hero"
import { KlienSection } from "@/components/sections/KlienSection"
import { LayananSection } from "@/components/sections/LayananSection"
import { PetaSection } from "@/components/sections/PetaSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { JsonLd } from "@/components/seo/JsonLd"
import { CtaBanner } from "@/components/site/CtaBanner"
import { KenapaKami } from "@/components/tentang/KenapaKami"
import { fetchBeranda, type BerandaKonten } from "@/lib/annasr/beranda"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"
import { faqLd, localBusinessLd, websiteLd } from "@/lib/seo/structured-data"
import { publicBaseUrl } from "@/lib/seo/urls"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const deskripsi =
  "Jasa perencanaan, pengawasan, perizinan (PBG & SLF), dan konstruksi bangunan, jalan, jembatan, serta irigasi di Kabupaten Jombang, Jawa Timur."

/**
 * Judul tab & deskripsi SEO diambil dari CMS (situs.brandNama/tagline)
 * dengan fallback, supaya edit brand di Strapi langsung ke halaman utama.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const konten = await fetchKontenSitus(locale)
  const brand = konten.situs.brandNama || "CV. AN NASR KONSULTAN"
  const tagline =
    konten.situs.brandTagline || "Konsultan Teknik Sipil & Konstruksi Jombang"

  return {
    title: `${brand} — ${tagline}`,
    description: deskripsi,
  }
}

const IKON_LAYANAN: LucideIcon[] = [
  Building2,
  ClipboardCheck,
  FileCheck2,
  HardHat,
]

const slugify = (teks: string) =>
  teks
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")

function layananKeItem(konten: BerandaKonten["layanan"]) {
  return konten.map((l, i) => ({
    slug: slugify(l.judul) || `layanan-${i + 1}`,
    nama: l.judul,
    ikon: IKON_LAYANAN[i % IKON_LAYANAN.length] ?? Building2,
    ringkas: l.ringkas,
    detail: [l.ringkas],
    gambar: l.gambar,
    alt: l.judul,
    galeri: [],
    deskripsi: l.ringkas,
    manfaat: [],
  }))
}

function artikelKeItem(konten: BerandaKonten["artikel"]) {
  return konten.map((a) => ({
    slug: slugify(a.judul) || "artikel",
    judul: a.judul,
    ringkas: a.ringkas,
    tanggal: a.tanggal,
    kategori: a.kategori,
    penulis: "Tim CV. AN NASR KONSULTAN",
    gambar: a.gambar,
    isi: [a.ringkas],
  }))
}

export default async function BerandaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const [konten, kontenSitus] = await Promise.all([
    fetchBeranda(locale),
    fetchKontenSitus(locale),
  ])

  const baseUrl = publicBaseUrl()
  const ogImage = `${baseUrl}/images/annasr/hero-konstruksi.jpg`

  return (
    <>
      <JsonLd
        data={[
          baseUrl
            ? localBusinessLd({
                url: baseUrl,
                situs: kontenSitus.situs,
                kontak: kontenSitus.kontak,
                image: ogImage,
              })
            : null,
          baseUrl ? websiteLd(baseUrl) : null,
          faqLd(konten.faq),
        ]}
      />
      <Hero
        hero={konten.hero}
        brand={kontenSitus.situs.brandNama}
        tagline={kontenSitus.situs.brandTagline}
        layanan={kontenSitus.layanan.map((l) => l.nama)}
      />
      <KlienSection items={konten.klien} />
      <FounderSection founder={konten.founder} />
      <KenapaKami alasan={kontenSitus.tentang.alasan} />
      <LayananSection items={layananKeItem(konten.layanan)} />
      <PortfolioSection items={konten.portfolio} />
      <PetaSection kota={konten.kotaProyek} />
      <ArtikelSection items={artikelKeItem(konten.artikel)} />
      <FaqSection items={konten.faq} />
      <CtaBanner judul={konten.cta?.judul} deskripsi={konten.cta?.deskripsi} />
    </>
  )
}
