import { BriefcaseBusiness } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { JobCard } from "@/components/karir/JobCard"
import { JsonLd } from "@/components/seo/JsonLd"
import { EmptyState } from "@/components/site/EmptyState"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale, Link } from "@/lib/navigation"
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
          {konten.karir.length === 0 ? (
            <EmptyState
              ikon={BriefcaseBusiness}
              judul="Lowongan belum tersedia"
              deskripsi="Saat ini belum ada posisi yang terbuka. Pantau halaman ini untuk informasi lowongan terbaru, atau kirimkan surat lamaran spontan ke tim kami."
              aksi={
                <Link
                  href="/kontak"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
                >
                  Hubungi Kami
                </Link>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {konten.karir.map((item) => (
                <JobCard key={item.slug || item.nama} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
