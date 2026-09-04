import { Check, ListChecks, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { ApplyKarirButton } from "@/components/karir/ApplyKarirButton"
import { ShareKarir } from "@/components/karir/ShareKarir"
import { JsonLd } from "@/components/seo/JsonLd"
import { PageHero } from "@/components/site/PageHero"
import { Button } from "@/components/ui/button"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale, Link } from "@/lib/navigation"
import { articleLd } from "@/lib/seo/structured-data"
import { publicBaseUrl } from "@/lib/seo/urls"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}

  const konten = await fetchKontenSitus(locale)
  const item = konten.karir.find((p) => p.slug === slug)

  return {
    title: `${item?.nama ?? "Lowongan"} — CV. AN NASR KONSULTAN`,
    description: item?.ringkas,
  }
}

export default async function DetailKarir({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const konten = await fetchKontenSitus(locale)
  const item = konten.karir.find((p) => p.slug === slug)
  if (!item) notFound()

  const tutup = item.status === "ditutup"
  const baseUrl = publicBaseUrl()

  return (
    <>
      <JsonLd
        data={[
          baseUrl
            ? articleLd({
                url: (() => {
                  const u = new URL(`/karir/${item.slug}`, baseUrl)

                  return u.href
                })(),
                judul: item.nama,
                ringkas: item.ringkas,
              })
            : null,
        ]}
      />
      <PageHero
        eyebrow="Karir"
        judul={item.nama}
        teks={`${item.tipe} · ${item.lokasi}`}
      />

      <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-3xl">
          {/* Job Description */}
          <div>
            <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
              Deskripsi Pekerjaan
            </h2>
            {item.deskripsi ? (
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {item.deskripsi}
              </p>
            ) : null}
            {item.tanggungJawab.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {item.tanggungJawab.map((t) => (
                  <li key={t} className="text-muted-foreground flex gap-3">
                    <ListChecks className="text-accent mt-0.5 size-4 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Qualifications */}
          {item.kualifikasi.length > 0 ? (
            <div className="mt-14">
              <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                Kualifikasi
              </h2>
              <ul className="mt-6 space-y-3">
                {item.kualifikasi.map((k, i) => (
                  <li key={k} className="text-muted-foreground flex gap-3">
                    <span className="text-accent text-sm font-bold">
                      {i + 1}.
                    </span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Benefits */}
          {item.manfaat.length > 0 ? (
            <div className="mt-14">
              <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                Keuntungan
              </h2>
              <ul className="mt-6 space-y-3">
                {item.manfaat.map((m) => (
                  <li key={m} className="text-muted-foreground flex gap-3">
                    <Check className="text-accent mt-0.5 size-4 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Apply CTA — kirim lamaran via email (mailto) */}
          <div className="mt-16">
            {tutup ? (
              <Button
                disabled
                variant="outline"
                size="lg"
                className="w-full rounded-full"
              >
                Lowongan Ditutup
              </Button>
            ) : (
              <ApplyKarirButton
                email={konten.kontak.email}
                posisi={item.nama}
              />
            )}
            <div className="mt-8">
              <ShareKarir
                url={`${baseUrl}/karir/${item.slug}`}
                judul={item.nama}
              />
            </div>
            <p className="text-muted-foreground mt-4 flex items-center justify-center gap-1.5 text-center text-sm">
              <Sparkles className="text-accent size-4" />
              Kirimkan CV &amp; portofolio Anda — tim kami segera merespons.
            </p>
            <div className="mt-6 text-center">
              <Link
                href="/karir"
                className="text-primary hover:text-accent text-sm font-medium transition-colors"
              >
                ← Kembali ke daftar lowongan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
