import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { JobCard } from "@/components/karir/JobCard"
import { JsonLd } from "@/components/seo/JsonLd"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"
import { breadcrumbLd } from "@/lib/seo/structured-data"
import { publicBaseUrl } from "@/lib/seo/urls"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  return {
    title: "Karir — Bergabung Bersama CV. AN NASR KONSULTAN",
    description:
      "Lowongan kerja terbaru di CV. AN NASR KONSULTAN: drafter, pengawas lapangan, estimator, dan administrasi proyek di Jombang.",
  }
}

export default async function KarirPage({
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
                  { name: "Karir", path: "/karir" },
                ],
              })
            : null,
        ]}
      />
      <PageHero
        eyebrow="Karir"
        judul={konten.karirHero.judul}
        teks={konten.karirHero.deskripsi}
      />

      <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          {/* Desktop: 3 kolom · Tablet: 2 kolom · Mobile: 1 kolom */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {konten.karir.map((item) => (
              <JobCard key={item.slug || item.nama} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
