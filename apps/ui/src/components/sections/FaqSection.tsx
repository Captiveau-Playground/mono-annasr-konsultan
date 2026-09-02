"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Reveal } from "@/components/site/Reveal"
import { SectionHeading } from "@/components/site/SectionHeading"
import type { BerandaKonten } from "@/lib/annasr/beranda"

const faq = [
  {
    tanya: "Layanan apa saja yang bisa dikerjakan CV. An Nasr Konsultan?",
    jawab:
      "Kami menangani perencanaan teknis, pengawasan pelaksanaan, pengurusan perizinan bangunan (PBG dan SLF), serta pelaksanaan konstruksi bangunan gedung, jalan, jembatan, dan irigasi.",
  },
  {
    tanya: "Bagaimana tahapan kerja sama dari awal sampai selesai?",
    jawab:
      "Dimulai dari konsultasi kebutuhan, survey lapangan, penyusunan desain dan RAB, penyiapan dokumen serta perizinan, pelaksanaan pekerjaan, pengawasan mutu, hingga serah terima beserta dokumen as built.",
  },
  {
    tanya: "Berapa lama pengurusan PBG dan SLF?",
    jawab:
      "Durasi bergantung pada kelengkapan berkas teknis dan antrean verifikasi dinas terkait. Umumnya berkas teknis kami siapkan dalam 1–2 minggu, lalu proses pengajuan kami pantau sampai persetujuan terbit.",
  },
  {
    tanya: "Apakah bisa menangani proyek di luar Kabupaten Jombang?",
    jawab:
      "Bisa. Selain Jombang, kami pernah menangani pekerjaan di Mojokerto, Kediri, Nganjuk, Surabaya, Malang, hingga beberapa kota di luar Jawa Timur.",
  },
  {
    tanya: "Bagaimana skema biaya jasa konsultan?",
    jawab:
      "Biaya disusun berdasarkan lingkup pekerjaan, nilai konstruksi, dan durasi penugasan. Setelah konsultasi awal, kami sampaikan penawaran tertulis yang rinci tanpa biaya tersembunyi.",
  },
  {
    tanya: "Apakah progres proyek dilaporkan secara berkala?",
    jawab:
      "Ya. Kami menyampaikan laporan harian, mingguan, dan dokumentasi visual pekerjaan sehingga pemberi tugas dapat memantau progres serta realisasi pembayaran termin.",
  },
]

export function FaqSection({
  items: itemsFaq,
}: {
  items?: BerandaKonten["faq"]
}) {
  const [aktif, setAktif] = useState<number | null>(0)

  return (
    <section className="bg-surface scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        {/* 2 kolom dalam 1 baris: judul kiri (sticky), daftar FAQ kanan (rata atas) */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              eyebrow="FAQ"
              judul={"Pertanyaan yang\nSering Diajukan"}
              deskripsi="Jawaban singkat untuk kebutuhan yang paling sering ditanyakan calon klien kami."
              align="left"
            />
          </div>

          <div className="flex flex-col gap-3">
            {(itemsFaq ?? faq).map((f, i) => {
              const terbuka = aktif === i

              return (
                <Reveal key={f.tanya} delay={i * 0.03}>
                  <div className="border-border bg-card rounded-xl border">
                    <button
                      type="button"
                      onClick={() => setAktif(terbuka ? null : i)}
                      aria-expanded={terbuka}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-foreground min-w-0 flex-1 text-sm font-medium sm:text-base">
                        {f.tanya}
                      </span>
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          terbuka
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Plus
                          className={`size-4 transition-transform duration-300 ${
                            terbuka ? "rotate-45" : "rotate-0"
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      id={`faq-panel-${i}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        terbuka ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div
                        className={`min-h-0 overflow-hidden transition-opacity duration-300 ${
                          terbuka ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <p className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                          {f.jawab}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
