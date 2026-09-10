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
import { JangkauanSection } from "@/components/sections/JangkauanSection"
import { KlienSection } from "@/components/sections/KlienSection"
import { LayananSection } from "@/components/sections/LayananSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { JsonLd } from "@/components/seo/JsonLd"
import { CtaBanner } from "@/components/site/CtaBanner"
import { KenapaKami } from "@/components/tentang/KenapaKami"
import { fetchBeranda } from "@/lib/annasr/beranda"
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

function layananKeItem(
  konten: {
    slug?: string
    nama?: string
    judul?: string
    ringkas: string
    gambar: string
  }[]
) {
  return konten.map((l, i) => {
    const nama = l.nama ?? l.judul ?? `Layanan ${i + 1}`

    return {
      // Slug asli dari API bila ada (jangan re-slugify judul — bisa beda & 404).
      slug:
        (l.slug && l.slug.length > 0 ? l.slug : slugify(nama)) ||
        `layanan-${i + 1}`,
      nama,
      ikon: IKON_LAYANAN[i % IKON_LAYANAN.length] ?? Building2,
      ringkas: l.ringkas,
      detail: [l.ringkas],
      gambar: l.gambar,
      alt: nama,
      galeri: [],
      deskripsi: l.ringkas,
      manfaat: [],
    }
  })
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
        layanan={konten.layanan.map((l) => l.judul)}
      />
      <KlienSection items={konten.klien} />
      <FounderSection founder={konten.founder} />
      <KenapaKami alasan={konten.keunggulan} />
      <LayananSection items={layananKeItem(konten.layanan)} />
      <PortfolioSection items={konten.portfolio} />
      <JangkauanSection
        judul={konten.jangkauanJudul}
        deskripsi={konten.jangkauanDeskripsi}
        kota={konten.kotaProyek}
        statistik={konten.statistik}
      />
      <ArtikelSection items={konten.artikel} />
      <FaqSection items={konten.faq} />
      <CtaBanner judul={konten.cta?.judul} deskripsi={konten.cta?.deskripsi} />
    </>
  )
}
