import { Briefcase, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"
import { Button } from "@/components/ui/button"
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
      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {posisi.map((p, i) => (
              <Reveal key={p.nama} delay={i * 0.06} className="h-full">
                <article className="border-border bg-card flex h-full flex-col rounded-2xl border p-6 text-center shadow-[var(--shadow-soft)]">
                  <span className="bg-primary/8 text-primary mx-auto flex size-10 items-center justify-center rounded-xl">
                    <Briefcase className="size-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-foreground mt-4 text-lg">{p.nama}</h3>
                  <p className="text-muted-foreground mt-1.5 flex items-center justify-center gap-1.5 text-xs">
                    <MapPin className="text-primary size-3.5" />
                    {p.lokasi} · {p.tipe}
                  </p>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {p.teks}
                  </p>
                  <Button
                    asChild
                    size="pill"
                    className="bg-accent text-accent-foreground hover:bg-accent mx-auto mt-6 transition-none"
                  >
                    <a
                      href={`https://wa.me/${perusahaan.whatsapp}?text=${encodeURIComponent(
                        `Halo, saya ingin melamar posisi ${p.nama} di CV. AN NASR KONSULTAN.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lamar Posisi Ini
                    </a>
                  </Button>
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
