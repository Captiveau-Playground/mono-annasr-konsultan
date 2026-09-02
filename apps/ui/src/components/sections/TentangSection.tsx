import { Compass, Flag } from "lucide-react"
import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { founder } from "@/data/perusahaan"

const kartu = [
  {
    ikon: Compass,
    judul: "Visi",
    teks: "Menjadi mitra konsultan teknik dan konstruksi yang terpercaya di Jawa Timur melalui kualitas pekerjaan dan integritas layanan.",
  },
  {
    ikon: Flag,
    judul: "Misi",
    teks: "Menghadirkan perencanaan yang akurat, pengawasan yang disiplin, serta pelaksanaan konstruksi yang tepat mutu, biaya, dan waktu.",
  },
]

export function TentangSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <Reveal className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <Image
            src="/images/annasr/founder.jpg"
            alt={`${founder.nama}, ${founder.jabatan} CV. AN NASR KONSULTAN`}
            width={1024}
            height={1200}
            className="mx-auto w-full max-w-sm rounded-[2rem] object-cover shadow-[var(--shadow-lift)]"
          />
          <div className="text-center lg:text-left">
            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
              Founder
            </p>
            <h2 className="text-foreground mt-3 text-3xl leading-[1.12] text-balance sm:text-4xl lg:text-5xl">
              {founder.nama}
            </h2>
            <p className="text-accent-foreground mt-1.5 text-sm font-medium">
              <span className="bg-accent rounded-full px-3 py-1">
                {founder.jabatan}
              </span>
            </p>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed">
              {founder.teks}
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal arah="left" className="text-center lg:text-left">
            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
              Tentang Kami
            </p>
            <h2 className="text-foreground mt-3 text-3xl leading-[1.12] text-balance sm:text-4xl lg:text-5xl">
              Tentang CV. AN NASR KONSULTAN
            </h2>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed">
              CV. AN NASR KONSULTAN adalah penyedia jasa konsultansi teknik
              sipil dan arsitektur yang berkedudukan di Kabupaten Jombang, Jawa
              Timur. Kami menangani pekerjaan perencanaan, pengawasan,
              pengurusan perizinan bangunan, serta pelaksanaan konstruksi untuk
              instansi pemerintah, lembaga, maupun perorangan.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Tujuan kami sederhana: memastikan setiap rencana pembangunan
              berjalan tepat mutu, tepat biaya, dan tepat waktu. Dengan dukungan
              tenaga ahli di bidang struktur, jalan, jembatan, dan sumber daya
              air, kami menghadirkan solusi pembangunan yang profesional dan
              sesuai standar teknis yang berlaku.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {kartu.map((k) => {
                const Ikon = k.ikon

                return (
                  <div
                    key={k.judul}
                    className="border-border bg-card rounded-2xl border p-5 text-left"
                  >
                    <span className="bg-primary/8 text-primary flex size-10 items-center justify-center rounded-xl">
                      <Ikon className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-foreground mt-3 block font-[family-name:var(--font-heading)] text-base font-semibold">
                      {k.judul}
                    </span>
                    <span className="text-muted-foreground mt-1.5 block text-sm leading-relaxed">
                      {k.teks}
                    </span>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal arah="right">
            <Image
              src="/images/annasr/tim-perusahaan.jpg"
              alt="Seluruh pegawai CV. AN NASR KONSULTAN berfoto bersama di depan kantor"
              width={1400}
              height={1000}
              className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-lift)]"
            />
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Tim CV. AN NASR KONSULTAN — Jombang, Jawa Timur
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
