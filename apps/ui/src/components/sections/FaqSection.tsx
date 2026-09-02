"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"

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

export function FaqSection() {
  const [aktif, setAktif] = useState<number | null>(0)

  return (
    <SectionShell tone="krem" judul={"Pertanyaan yang\nSering Diajukan"}>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {faq.map((f, i) => {
          const terbuka = aktif === i

          return (
            <Reveal key={f.tanya} delay={i * 0.04}>
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
                        : "bg-surface text-primary"
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
    </SectionShell>
  )
}
