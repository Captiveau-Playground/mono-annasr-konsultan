import { ArrowRight, Check, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { CtaBanner } from "@/components/site/CtaBanner"
import { Reveal } from "@/components/site/Reveal"
import { Button } from "@/components/ui/button"
import { layanan } from "@/data/perusahaan"
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

  const item = layanan.find((l) => l.slug === slug)
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

      <CtaBanner />
    </>
  )
}
