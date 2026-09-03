import { BadgeCheck, Handshake } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { JsonLd } from "@/components/seo/JsonLd"
import { PageHero } from "@/components/site/PageHero"
import { fetchRekanan, type RekananItem } from "@/lib/annasr/rekanan"
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
    title: "Rekanan & Sertifikat Kerjasama — CV. AN NASR KONSULTAN",
    description:
      "Katalog rekanan dan sertifikat kerjasama CV. AN NASR KONSULTAN: pemerintah daerah, desa, kecamatan, yayasan, hingga BUMD.",
  }
}

/**
 * Kolom grid dinamis: 1 item → 1 kolom penuh; 2 → 2 kolom; 3 → 3 kolom;
 * 4+ → maksimal 4 kolom beberapa baris.
 */
function kolomGrid(jumlah: number): string {
  const kelas: Record<number, string> = {
    1: "grid-cols-1 max-w-2xl",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  return kelas[Math.min(Math.max(jumlah, 1), 4)] ?? "grid-cols-1"
}

function KartuRekanan({ item }: { item: RekananItem }) {
  return (
    <article className="border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="bg-surface/60 flex aspect-[4/3] items-center justify-center overflow-hidden p-4">
        {item.gambar ? (
          // ESLint(next/no-img-element) absen di config ini — gambar CMS
          // dipakai polos (bukan <Image>) agar tidak kena blokir optimizer SSRF.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.gambar}
            alt={item.alt}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="bg-primary/8 text-primary flex flex-col items-center gap-2 text-center">
            <Handshake className="size-10" strokeWidth={1.4} />
            <span className="text-xs font-medium tracking-wide uppercase">
              Sertifikat kerjasama
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-foreground text-base leading-snug font-semibold">
          {item.nama}
        </h2>
        {item.instansi ? (
          <p className="text-accent mt-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
            {item.instansi}
          </p>
        ) : null}
        {item.keterangan ? (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {item.keterangan}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export default async function RekananPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const daftar = await fetchRekanan(locale)

  // Belum ada data di CMS → halaman ini tidak ada (404).
  if (daftar.length === 0) notFound()

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
                  { name: "Rekanan", path: "/rekanan" },
                ],
              })
            : null,
        ]}
      />
      <PageHero
        eyebrow="Rekanan"
        judul="Sertifikat kerjasama dengan rekanan"
        teks="Dokumentasi kepercayaan instansi, desa, kecamatan, yayasan, dan badan usaha terhadap layanan kami."
      />
      <section className="bg-background px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className={`grid gap-6 ${kolomGrid(daftar.length)} mx-auto`}>
            {daftar.map((item) => (
              <KartuRekanan key={item.nama} item={item} />
            ))}
          </div>
          <p className="text-muted-foreground/80 mt-12 flex items-center justify-center gap-2 text-center text-sm">
            <BadgeCheck className="text-accent size-4" />
            {daftar.length} rekanan tercatat — sertifikat asli dapat
            ditampilkan/diperbarui lewat CMS.
          </p>
        </div>
      </section>
    </>
  )
}
