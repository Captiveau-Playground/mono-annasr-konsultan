import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { LayananSection } from "@/components/sections/LayananSection"
import { ProsesSection } from "@/components/sections/ProsesSection"
import { JsonLd } from "@/components/seo/JsonLd"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"
import { breadcrumbLd, serviceListLd } from "@/lib/seo/structured-data"
import { publicBaseUrl } from "@/lib/seo/urls"

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

  const konten = await fetchKontenSitus(locale)
  const baseUrl = publicBaseUrl()

  return (
    <>
      <JsonLd
        data={[
          baseUrl
            ? breadcrumbLd({
                url: baseUrl,
                items: [
                  { name: "Beranda", path: "/" },
                  { name: "Layanan", path: "/layanan" },
                ],
              })
            : null,
          baseUrl
            ? serviceListLd({
                url: baseUrl,
                layanan: konten.layanan.map((l) => ({
                  nama: l.nama,
                  ringkas: l.ringkas,
                  slug: l.slug,
                })),
              })
            : null,
        ]}
      />
      <PageHero
        eyebrow="Layanan"
        judul="Layanan teknik yang lengkap dan terintegrasi"
        teks="Dari studi awal hingga serah terima pekerjaan, seluruh kebutuhan teknis proyek Anda dapat kami tangani dalam satu koordinasi."
      />
      <LayananSection lengkap items={konten.layanan} />
      <ProsesSection items={konten.proses} />
      <CtaBanner />
    </>
  )
}
