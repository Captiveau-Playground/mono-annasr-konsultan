import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { KontakSection } from "@/components/sections/KontakSection"
import { JsonLd } from "@/components/seo/JsonLd"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"
import { breadcrumbLd, contactPageLd } from "@/lib/seo/structured-data"
import { publicBaseUrl } from "@/lib/seo/urls"

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
                  { name: "Kontak", path: "/kontak" },
                ],
              })
            : null,
          baseUrl
            ? contactPageLd({
                url: baseUrl,
                situs: konten.situs,
                kontak: konten.kontak,
              })
            : null,
        ]}
      />
      <PageHero
        eyebrow="Kontak"
        judul="Mari bicarakan rencana proyek Anda"
        teks="Tim kami siap membantu menghitung kebutuhan teknis, dokumen perizinan, hingga estimasi biaya pekerjaan."
      />
      <KontakSection />
    </>
  )
}
