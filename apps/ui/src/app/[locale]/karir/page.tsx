import { ArrowRight, Briefcase, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"
import { perusahaan } from "@/data/perusahaan"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Karir — CV. AN NASR KONSULTAN"
const deskripsi =
  "Lowongan dan kesempatan berkarir di CV. AN NASR KONSULTAN Jombang untuk tenaga teknik sipil, drafter, dan pengawas lapangan."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

const posisi = [
  {
    nama: "Drafter Teknik Sipil",
    tipe: "Penuh Waktu",
    lokasi: "Jombang",
    teks: "Menyusun gambar kerja bangunan, jalan, dan jembatan menggunakan AutoCAD.",
  },
  {
    nama: "Pengawas Lapangan",
    tipe: "Penuh Waktu",
    lokasi: "Jombang & sekitarnya",
    teks: "Mengawasi mutu, volume, dan progres pekerjaan konstruksi di lokasi proyek.",
  },
  {
    nama: "Estimator / Quantity Surveyor",
    tipe: "Penuh Waktu",
    lokasi: "Jombang",
    teks: "Menyusun rencana anggaran biaya dan analisa harga satuan pekerjaan.",
  },
  {
    nama: "Administrasi Proyek",
    tipe: "Penuh Waktu",
    lokasi: "Jombang",
    teks: "Mengelola dokumen kontrak, laporan, dan administrasi perizinan proyek.",
  },
]

export default async function KarirPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  return (
    <>
      <PageHero
        eyebrow="Karir"
        judul="Tumbuh bersama tim teknik kami"
        teks="Kami mencari orang-orang yang teliti, disiplin, dan senang belajar di dunia perencanaan dan konstruksi."
      />

      <section className="bg-background py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
              Lowongan Terbuka
            </p>
            <h2 className="text-foreground mt-3 text-3xl leading-[1.12] text-balance sm:text-4xl lg:text-5xl">
              Posisi yang sedang kami cari
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Bergabunglah dengan tim yang menangani proyek perencanaan,
              pengawasan, perizinan, dan konstruksi di Jombang dan sekitarnya.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {posisi.map((p, i) => (
              <Reveal key={p.nama} delay={i * 0.05} className="h-full">
                <article className="border-border bg-card hover:bg-surface/60 flex h-full flex-col rounded-2xl border p-6 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <span className="bg-primary/8 text-primary flex size-11 items-center justify-center rounded-xl">
                      <Briefcase className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-muted-foreground bg-surface rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                      {p.tipe}
                    </span>
                  </div>

                  <h3 className="text-foreground mt-5 text-lg leading-snug font-semibold">
                    {p.nama}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
                    <MapPin className="text-primary size-3.5" />
                    {p.lokasi}
                  </p>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {p.teks}
                  </p>

                  <div className="mt-auto pt-5">
                    <a
                      href={`https://wa.me/${perusahaan.whatsapp}?text=${encodeURIComponent(
                        `Halo, saya ingin melamar posisi ${p.nama} di CV. AN NASR KONSULTAN.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    >
                      Lamar Posisi Ini
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="text-muted-foreground mt-10 text-center text-sm">
            Kirim CV dan portofolio Anda ke {perusahaan.email} atau hubungi kami
            melalui WhatsApp.
          </p>
        </div>
      </section>
    </>
  )
}
