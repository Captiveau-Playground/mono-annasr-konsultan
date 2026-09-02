import { ArrowRight, Check, FileCheck2, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { CtaBanner } from "@/components/site/CtaBanner"
import { Reveal } from "@/components/site/Reveal"
import { Button } from "@/components/ui/button"
import { layanan } from "@/data/perusahaan"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale, Link } from "@/lib/navigation"

export function generateStaticParams() {
  const locales = ["en", "cs"]

  return layanan.flatMap((item) =>
    locales.map((locale) => ({ locale, slug: item.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = layanan.find((l) => l.slug === slug)

  return {
    title: `${item?.nama ?? "Layanan"} — CV. AN NASR KONSULTAN`,
    description:
      item?.ringkas ??
      "Layanan teknik sipil dan konstruksi CV. AN NASR KONSULTAN di Kabupaten Jombang.",
  }
}

export default async function DetailLayanan({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const konten = await fetchKontenSitus(locale)
  const item = konten.layanan.find((l) => l.slug === slug)
  if (!item) notFound()

  const galeri = [{ src: item.gambar, alt: item.alt }, ...item.galeri]

  return (
    <>
      <section className="px-6 pt-32 pb-14 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Layanan
          </p>
          <h1 className="text-foreground mt-3 text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
            {item.nama}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed">
            {item.ringkas}
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {galeri.map((g, i) => (
              <Reveal
                key={g.alt}
                delay={i * 0.05}
                className={i === 0 ? "sm:col-span-2" : ""}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={1200}
                  height={800}
                  priority={i === 0}
                  sizes={i === 0 ? "80vw" : "(min-width:640px) 40vw, 80vw"}
                  className={`border-border w-full rounded-[1.5rem] border object-cover shadow-[var(--shadow-soft)] ${
                    i === 0 ? "aspect-[16/7]" : "aspect-[4/3]"
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-foreground text-2xl">Tentang layanan ini</h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            {item.deskripsi}
          </p>

          <h3 className="text-foreground mt-12 text-xl">
            Manfaat untuk proyek Anda
          </h3>
          <ul className="mx-auto mt-6 grid gap-3 text-left sm:grid-cols-2">
            {item.manfaat.map((m) => (
              <li
                key={m}
                className="border-border bg-card text-foreground/85 flex items-start gap-2.5 rounded-2xl border p-4 text-sm"
              >
                <Sparkles className="text-accent mt-0.5 size-4 shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-foreground mt-12 text-xl">Lingkup pekerjaan</h3>
          <ul className="mx-auto mt-6 grid gap-2.5 text-left sm:grid-cols-2">
            {item.detail.map((d) => (
              <li
                key={d}
                className="text-foreground/85 flex items-start gap-2 text-sm"
              >
                <Check className="text-primary mt-0.5 size-4 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <Button asChild size="pill" className="mt-10">
            <Link href="/kontak">
              Konsultasi {item.nama}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {item.alur ? <AlurLayanan nama={item.nama} alur={item.alur} /> : null}
      {item.persyaratan ? (
        <PersyaratanLayanan persyaratan={item.persyaratan} />
      ) : null}

      <CtaBanner />
    </>
  )
}

/** Alur pengerjaan bertahap — ditampilkan untuk layanan perencanaan & pengawasan. */
function AlurLayanan({
  nama,
  alur,
}: {
  nama: string
  alur: NonNullable<(typeof layanan)[number]["alur"]>
}) {
  return (
    <section className="bg-background px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Alur Pengerjaan
          </p>
          <h2 className="text-foreground mt-3 text-3xl leading-[1.12] text-balance sm:text-4xl">
            Bagaimana {nama} dikerjakan
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Enam langkah berurutan agar setiap tahap terukur dan hasilnya sesuai
            standar.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alur.map((langkah, i) => (
            <Reveal key={langkah.judul} delay={i * 0.04} className="h-full">
              <li className="group border-border bg-card hover:border-primary/25 relative h-full rounded-2xl border p-5 transition-colors">
                <span className="border-border bg-background text-primary flex size-11 items-center justify-center rounded-xl border font-[family-name:var(--font-heading)] text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-foreground mt-4 text-base leading-snug font-semibold">
                  {langkah.judul}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {langkah.teks}
                </p>
                {i < alur.length - 1 ? (
                  <ArrowRight className="text-primary/30 pointer-events-none absolute top-1/2 -right-4 hidden size-4 -translate-y-1/2 lg:block" />
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Kartu persyaratan PBG & SLF dengan daftar bernomor — khusus layanan perizinan. */
function PersyaratanLayanan({
  persyaratan,
}: {
  persyaratan: NonNullable<(typeof layanan)[number]["persyaratan"]>
}) {
  return (
    <section className="bg-surface px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Dokumen yang Perlu Disiapkan
          </p>
          <h2 className="text-foreground mt-3 text-3xl leading-[1.12] text-balance sm:text-4xl">
            Persyaratan Pengurusan
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Kami dampingi dari penyiapan berkas hingga dokumen terbit — lengkap
            dan siap diajukan.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {persyaratan.map((group, gi) => (
            <Reveal key={group.judul} delay={gi * 0.06} className="h-full">
              <div className="border-border bg-card flex h-full flex-col rounded-2xl border p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
                    <FileCheck2 className="size-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
                    {group.judul}
                  </h3>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {group.deskripsi}
                </p>
                <ol className="mt-6 flex flex-col gap-3">
                  {group.daftar.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-foreground/85 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
